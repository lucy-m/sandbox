namespace Stores

open Sutil

open SpringAnimate
open JsLib

module TickingSpring =
  let ticker = RxJs.interval(50)

  let make (tick: 'a Spring.Tick) (initial: 'a Spring): IStore<'a Spring> =
    let store = Store.make initial

    ticker.subscribe (fun _ ->
      let ticked = tick 0.01 store.Value

      if ticked <> store.Value
      then Store.set store ticked
      else ()
    )

    store

  let make1d = make Spring.dim1.tick
  let make2d = make Spring.dim2.tick