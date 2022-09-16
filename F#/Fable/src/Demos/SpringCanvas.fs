namespace Demos

open Sutil
open Sutil.DOM
open Feliz
open SpringAnimate
open Components

open JsLib

module SpringCanvas =
  let initial: Spring = {
    position = { x = 60.0; y = 35.0 }
    velocity = { x = 0.0; y = 0.0 }
    endPoint = { x = 300.0; y = 200.0 }
    properties = {
      stiffness = 8.0
      friction = 26.0
      weight = 4.0
    }
  }
  let springStore: IStore<Spring> = Store.make initial

  let ticker = RxJs.interval(50)
  ticker.subscribe(fun _ -> 
    let ticked = Spring.tick 0.01 springStore.Value
    Store.set springStore ticked
  )


  let cmpt () =
    Html.div [
      disposeOnUnmount [springStore]
      Svg.svg [
        Attr.width (length.px 600)
        Attr.height (length.px 400)
        Attr.style [
          Css.border (length.px 2, borderStyle.solid, color.black)
        ]

        bindFragment springStore SpringDisplay.cmpt
      ]
    ]
