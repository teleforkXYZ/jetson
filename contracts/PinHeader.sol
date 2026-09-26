// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./JetsonModule.sol";

/// @title PinHeader
/// @notice Forty signal pins. Hardware PWM only on 32 and 33, matching the
///         Nano header count in jetson-gpio. Pins do not move value.
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

    /// @param duty 0 to 1000.
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

    /// @notice Anyone may wipe the header while the board is idle or down.
    function clearHeader() external {
        uint8 state = _power();
        if (state != POWER_IDLE && state != POWER_DOWN) revert BadPower();
        for (uint8 pin = 1; pin <= 40; pin++) {
            delete pins[pin];
        }
        emit Cleared();
    }
}
