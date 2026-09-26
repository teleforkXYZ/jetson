# Jetson bus

Robinhood Chain. Chain id **4663**. Gas is ETH.
Pair, fixed in the source: NVDAx3L `0xF51fb54DE60f6e16252E852A5Ed0E60B8307606A`.
That address is the LongX pair. It is not the coin.

The coin slot starts empty. After the long.xyz launch, `JetsonBus.bindToken` once.
It reverts if you pass the pair, or the LONG 500 coin
`0xf55bb237ecc10cfe2fbaf62a61f95ceb03691e18`.

Nothing here takes a fee, mints, or pulls tokens.

## Deploy, this order

1. `JetsonBus`
2. `BootSequence`, `PinHeader`, `Eye`, `Harness`, `ModuleBay` — each constructor takes the bus
3. `seat(0..4)` in that same order
4. Leave `bindToken` until the coin exists
5. `lock()` only after the coin is bound and you want the wiring frozen

## What talks to what

| Slot | Contract | Opens when |
| --- | --- | --- |
| 0 | BootSequence | always. 30s between boot, infer, power down |
| 1 | PinHeader | boot or infer. PWM only on pins 32 and 33 |
| 2 | Eye | infer only. One hash per address per minute |
| 3 | Harness | boot or infer. Wire 0 pink, 1 blue, 2 yellow |
| 4 | ModuleBay | owner. Six bays for a later module that returns this bus |

`clearHeader` works only while idle or down.

Remix: add the folder, compiler 0.8.26, chain Robinhood Chain.
Do not deploy these on Ethereum mainnet.
