// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// One file for Remix. Compiler 0.8.26. No imports. No constructor args.
// Deploy this first. After the letscash.fun launch, call bindToken(CA).

error NotOwner();
error BadPower();
error Cooling();
error Bound();
error BadToken();
error Asleep();
error BadPin();

contract JetsonBus {
    uint8 public constant POWER_IDLE = 0;
    uint8 public constant POWER_BOOT = 1;
    uint8 public constant POWER_INFER = 2;
    uint8 public constant POWER_DOWN = 3;
    uint256 public constant COOLDOWN = 30 seconds;

    address public owner;
    address public token;
    bool public tokenBound;
    bool public locked;

    uint8 public power;
    uint256 public lastFlip;

    struct Pin {
        address claimer;
        uint8 mode; // 0 off, 1 in, 2 out, 3 pwm
        uint8 level;
        uint16 duty;
    }

    Pin[41] public pins;
    bytes32[3] public wires;
    bytes32 public frame;
    uint256 public frameCount;

    event PowerChanged(uint8 power);
    event TokenBound(address indexed token);
    event Locked();
    event PinTouched(uint8 indexed pin, address indexed who);
    event WireSent(uint8 indexed wire, bytes32 data);
    event Seen(bytes32 frameHash, uint256 frameCount);

    constructor() {
        owner = msg.sender;
        power = POWER_IDLE;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
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

    /// Forty pins. 32 and 33 pulse. Board must be on.
    function press(uint8 pin) external {
        if (!_live()) revert Asleep();
        if (pin < 1 || pin > 40) revert BadPin();
        Pin storage row = pins[pin];
        if (row.claimer == address(0)) {
            bool pwm = pin == 32 || pin == 33;
            row.claimer = msg.sender;
            row.mode = pwm ? 3 : 2;
            row.level = pwm ? 0 : 1;
            row.duty = pwm ? 1000 : 0;
        } else if (row.mode == 3) {
            row.duty = row.duty == 0 ? 500 : row.duty == 500 ? 1000 : 0;
        } else {
            row.level = row.level == 1 ? 0 : 1;
        }
        emit PinTouched(pin, msg.sender);
    }

    function clearHeader() external {
        if (power != POWER_IDLE && power != POWER_DOWN) revert BadPower();
        delete pins;
        emit PowerChanged(power);
    }

    /// 0 pink, 1 blue, 2 yellow.
    function send(uint8 wire, bytes32 data) external {
        if (!_live()) revert Asleep();
        if (wire > 2) revert BadPin();
        if (data == bytes32(0)) revert BadPin();
        wires[wire] = data;
        emit WireSent(wire, data);
    }

    function see(bytes32 frameHash) external {
        if (power != POWER_INFER) revert BadPower();
        if (frameHash == bytes32(0)) revert BadPin();
        frame = frameHash;
        frameCount += 1;
        emit Seen(frameHash, frameCount);
    }

    /// Call once after the letscash token exists.
    function bindToken(address next) external onlyOwner {
        if (locked || tokenBound) revert Bound();
        if (next == address(0)) revert BadToken();
        token = next;
        tokenBound = true;
        emit TokenBound(next);
    }

    function lock() external onlyOwner {
        if (!tokenBound) revert BadToken();
        locked = true;
        emit Locked();
    }

    function _flip(uint8 next) private {
        if (block.timestamp < lastFlip + COOLDOWN) revert Cooling();
        power = next;
        lastFlip = block.timestamp;
        emit PowerChanged(next);
    }

    function _live() private view returns (bool) {
        return power == POWER_BOOT || power == POWER_INFER;
    }
}
