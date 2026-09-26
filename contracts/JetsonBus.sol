// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./JetsonModule.sol";

/// @title JetsonBus
/// @notice Carrier. Holds the NVDAx3L pair and, once, the Jetson coin.
///         Does not take a fee and does not custody either token.
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

    /// @param slot 0 boot, 1 pins, 2 eye, 3 harness, 4 bay.
    function seat(uint8 slot, address module) external onlyOwner {
        if (locked) revert Bound();
        if (slot > SLOT_BAY) revert BadBus();
        if (module.code.length == 0) revert BadBus();
        if (IJetsonModule(module).bus() != address(this)) revert BadBus();
        seatOf[slot] = module;
        emit Seated(slot, module);
    }

    /// @notice One shot, after the long.xyz launch. Refuses the pair and LONG 500.
    function bindToken(address next) external onlyOwner {
        if (locked || tokenBound) revert Bound();
        if (next == address(0) || next == LONGX || next == NOT_JETSON) revert BadToken();
        if (next.code.length == 0) revert BadToken();
        token = next;
        tokenBound = true;
        emit TokenBound(next);
    }

    /// @notice Freezes seats and the coin address. Call only after bindToken.
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
