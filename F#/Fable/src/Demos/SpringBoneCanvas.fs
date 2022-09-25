namespace Demos

open Sutil
open Feliz
open Geometry
open SpringAnimate
open Components
open JsLib

module SpringBoneCanvas =
  let properties: Spring.Properties = {
      stiffness = 8.0
      friction = 40.0
      weight = 1.0
      resolution = 0.3
    }

  let initial: Point = { x = 40.0; y = 40.0 }
  let subsequent: Point[] =
    [| 20.0 .. 20.0 .. 160.0 |]
    |> Array.map (fun dx -> { x = initial.x + dx; y = initial.y })

  let springBone = 
    SpringBone.dim2.makeUniformStationary properties (initial, subsequent)
    |> SpringBone.dim2.nudge { x = 20.0; y = 100.0 }

  let cmpt () =
    let ticker = RxJs.interval(50)
    let store = Store.make springBone
    
    ticker.subscribe (fun _ ->
      let ticked = SpringBone.dim2.tick 0.01 store.Value
  
      if ticked <> store.Value
      then Store.set store ticked
      else ()
    )

    Html.div [
      Svg.svg [
        Attr.width (length.px 600)
        Attr.height (length.px 400)
        Attr.style [
          Css.border (length.px 2, borderStyle.solid, color.black)
        ]

        bindFragment store SpringBoneDisplay.cmpt
      ]
    ]
