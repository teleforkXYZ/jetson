// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./JetsonModule.sol";

/// @title ModuleBay
/// @notice Six extension bays. A bay module must point back at this same bus.
///         Installing does not pull a fee and does not take custody.
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
