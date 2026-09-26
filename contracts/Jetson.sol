// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// One file for Remix. No imports. Compiler 0.8.26.
// Deploy JetsonBus first. Then the five modules. Then seat them.

address constant LONGX = 0xF51fb54DE60f6e16252E852A5Ed0E60B8307606A;
address constant NOT_JETSON = 0xF55BB237ECC10CFE2FBAF62a61F95CEb03691e18;

uint8 constant SLOT_BOOT = 0;
uint8 constant SLOT_PINS = 1;
uint8 constant SLOT_EYE = 2;
uint8 constant SLOT_HARNESS = 3;
uint8 constant SLOT_BAY = 4;

uint8 constant POWER_IDLE = 0;
uint8 constant POWER_BOOT = 1;
uint8 constant POWER_INFER = 2;
uint8 constant POWER_DOWN = 3;

interface IBus {
    function owner() external view returns (address);
    function longx() external view returns (address);
    function token() external view returns (address);
    function locked() external view returns (bool);
    function seatOf(uint8 slot) external view returns (address);
}

interface IBoot {
    function power() external view returns (uint8);
}

interface IJetsonModule {
    function bus() external view returns (address);
}

error BadBus();
error NotOwner();
error BadPower();
error Cooling();
error Bound();
error BadToken();

abstract contract JetsonModule is IJetsonModule {
    IBus internal immutable carrier;

    constructor(address bus_) {
        if (bus_.code.length == 0) revert BadBus();
        carrier = IBus(bus_);
        if (carrier.longx() != LONGX) revert BadBus();
    }

    function bus() public view returns (address) {
        return address(carrier);
    }

    modifier onlyBusOwner() {
        if (msg.sender != carrier.owner()) revert NotOwner();
        _;
    }

    function _power() internal view returns (uint8) {
        address boot = carrier.seatOf(SLOT_BOOT);
        if (boot == address(0)) revert BadBus();
        return IBoot(boot).power();
    }

    function _live() internal view returns (bool) {
        uint8 state = _power();
        return state == POWER_BOOT || state == POWER_INFER;
    }
}

contract JetsonBus is IBus {
    address public immutable longx;
    address public owner;
    address public token;
    bool public tokenBound;
    bool public locked;

    mapping(uint8 => address) public seatOf;

    event Seated(uint8 indexed slot, address indexed module);
    event TokenBound(address indexed token);
    event Locked();

    constructor() {
        longx = LONGX;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function seat(uint8 slot, address module) external onlyOwner {
        if (locked) revert Bound();
        if (slot > SLOT_BAY) revert BadBus();
        if (module.code.length == 0) revert BadBus();
        if (IJetsonModule(module).bus() != address(this)) revert BadBus();
        seatOf[slot] = module;
        emit Seated(slot, module);
    }

    function bindToken(address next) external onlyOwner {
        if (locked || tokenBound) revert Bound();
        if (next == address(0) || next == LONGX || next == NOT_JETSON) revert BadToken();
        if (next.code.length == 0) revert BadToken();
        token = next;
        tokenBound = true;
        emit TokenBound(next);
    }

    function lock() external onlyOwner {
        if (!tokenBound) revert BadToken();
        if (
            seatOf[SLOT_BOOT] == address(0) || seatOf[SLOT_PINS] == address(0) || seatOf[SLOT_EYE] == address(0)
                || seatOf[SLOT_HARNESS] == address(0) || seatOf[SLOT_BAY] == address(0)
        ) revert BadBus();
        locked = true;
        emit Locked();
    }
}

contract BootSequence is JetsonModule, IBoot {
    uint256 public constant COOLDOWN = 30 seconds;

    uint8 public power;
    uint256 public lastFlip;

    event PowerChanged(uint8 power);

    constructor(address bus_) JetsonModule(bus_) {
        power = POWER_IDLE;
    }

    function boot() external {
        if (power != POWER_IDLE && power != POWER_DOWN) revert BadPower();
        _flip(POWER_BOOT);
    }

    function infer() external {
        if (power != POWER_BOOT) revert BadPower();
        _flip(POWER_INFER);
    }

    function powerDown() external {
        if (power != POWER_BOOT && power != POWER_INFER) revert BadPower();
        _flip(POWER_DOWN);
    }

    function _flip(uint8 next) private {
        if (block.timestamp < lastFlip + COOLDOWN) revert Cooling();
        power = next;
        lastFlip = block.timestamp;
        emit PowerChanged(next);
    }
}

contract PinHeader is JetsonModule {
    uint8 internal constant MODE_IN = 1;
    uint8 internal constant MODE_OUT = 2;
    uint8 internal constant MODE_PWM = 3;

    struct Pin {
        address claimer;
        uint8 mode;
        uint8 level;
        uint16 duty;
    }

    mapping(uint8 => Pin) public pins;

    event Claimed(uint8 indexed pin, address indexed claimer, uint8 mode);
    event Released(uint8 indexed pin, address indexed claimer);
    event Written(uint8 indexed pin, uint8 level);
    event Pulsed(uint8 indexed pin, uint16 duty);
    event Cleared();

    constructor(address bus_) JetsonModule(bus_) {}

    function claim(uint8 pin, uint8 mode) external {
        if (pin < 1 || pin > 40) revert BadBus();
        if (!_live()) revert BadPower();
        if (mode < MODE_IN || mode > MODE_PWM) revert BadBus();
        if (mode == MODE_PWM && pin != 32 && pin != 33) revert BadBus();
        Pin storage row = pins[pin];
        if (row.claimer != address(0)) revert Bound();
        row.claimer = msg.sender;
        row.mode = mode;
        emit Claimed(pin, msg.sender, mode);
    }

    function write(uint8 pin, uint8 level) external {
        if (level > 1) revert BadBus();
        if (!_live()) revert BadPower();
        Pin storage row = pins[pin];
        if (row.claimer != msg.sender || row.mode != MODE_OUT) revert NotOwner();
        row.level = level;
        emit Written(pin, level);
    }

    function pwm(uint8 pin, uint16 duty) external {
        if (duty > 1000) revert BadBus();
        if (!_live()) revert BadPower();
        Pin storage row = pins[pin];
        if (row.claimer != msg.sender || row.mode != MODE_PWM) revert NotOwner();
        row.duty = duty;
        emit Pulsed(pin, duty);
    }

    function release(uint8 pin) external {
        Pin storage row = pins[pin];
        if (row.claimer != msg.sender) revert NotOwner();
        delete pins[pin];
        emit Released(pin, msg.sender);
    }

    function clearHeader() external {
        uint8 state = _power();
        if (state != POWER_IDLE && state != POWER_DOWN) revert BadPower();
        for (uint8 pin = 1; pin <= 40; pin++) {
            delete pins[pin];
        }
        emit Cleared();
    }
}

contract Eye is JetsonModule {
    struct Frame {
        bytes32 hash;
        address observer;
        uint64 at;
    }

    Frame public latest;
    uint256 public frameCount;
    mapping(address => uint256) public seenAt;

    event Seen(uint256 indexed index, address indexed observer, bytes32 hash);

    constructor(address bus_) JetsonModule(bus_) {}

    function see(bytes32 frameHash) external {
        if (frameHash == bytes32(0)) revert BadBus();
        if (_power() != POWER_INFER) revert BadPower();
        if (block.timestamp < seenAt[msg.sender] + 60) revert Cooling();
        seenAt[msg.sender] = block.timestamp;
        latest = Frame(frameHash, msg.sender, uint64(block.timestamp));
        frameCount += 1;
        emit Seen(frameCount, msg.sender, frameHash);
    }
}

contract Harness is JetsonModule {
    struct Signal {
        bytes32 data;
        address from;
        uint64 at;
    }

    mapping(uint8 => Signal) public signalOf;

    event Sent(uint8 indexed wire, address indexed from, bytes32 data);

    constructor(address bus_) JetsonModule(bus_) {}

    function send(uint8 wire, bytes32 data) external {
        if (wire > 2) revert BadBus();
        if (!_live()) revert BadPower();
        signalOf[wire] = Signal(data, msg.sender, uint64(block.timestamp));
        emit Sent(wire, msg.sender, data);
    }
}

contract ModuleBay is JetsonModule {
    struct Bay {
        address module;
        bytes32 label;
        bool live;
    }

    mapping(uint8 => Bay) public bays;

    event Installed(uint8 indexed bay, address indexed module, bytes32 label);
    event Disabled(uint8 indexed bay);

    constructor(address bus_) JetsonModule(bus_) {}

    function install(uint8 bay, address module, bytes32 label) external onlyBusOwner {
        if (carrier.locked()) revert Bound();
        if (bay > 5) revert BadBus();
        if (module.code.length == 0) revert BadBus();
        if (IJetsonModule(module).bus() != address(carrier)) revert BadBus();
        bays[bay] = Bay(module, label, true);
        emit Installed(bay, module, label);
    }

    function disable(uint8 bay) external onlyBusOwner {
        if (carrier.locked()) revert Bound();
        if (bay > 5) revert BadBus();
        bays[bay].live = false;
        emit Disabled(bay);
    }
}
