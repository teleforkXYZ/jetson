// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./JetsonModule.sol";

/// @title Eye
/// @notice Camera log. A frame hash, not a price. Opens only while inferring.
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
