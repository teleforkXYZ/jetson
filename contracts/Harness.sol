// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./JetsonModule.sol";

/// @title Harness
/// @notice Three wires. 0 pink, 1 blue, 2 yellow. Signals are bytes, not coins.
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
