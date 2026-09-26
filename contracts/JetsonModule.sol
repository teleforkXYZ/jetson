// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// NVDAx3L LongX on long.xyz. The pair. Not the Jetson coin.
address constant LONGX = 0xF51fb54DE60f6e16252E852A5Ed0E60B8307606A;

// LONG 500. This bus must refuse it.
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

/// @dev Modules only read the bus. None of them move coins.
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
