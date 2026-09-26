// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./JetsonModule.sol";

/// @title BootSequence
/// @notice Shared power switch. Anyone may flip it. Thirty seconds between flips.
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
