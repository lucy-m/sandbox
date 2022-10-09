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

  let testPath = 
    PathPointShape.parseString "M 1.4434994,1.8945929 15.607837,3.0674363 19.306804,1.1728432 24.810146,0.36087483 c 0,0 2.526122,3.78918587 6.31531,2.70656147 3.789185,-1.0826247 12.269745,-2.43590531 12.269745,-2.43590531 l 16.961117,0.18043741 2.616343,3.3380923 -7.397935,2.7967799 7.037059,1.9848118 -7.037059,3.5185296 c 0,0 -4.691372,-8.3001213 -9.472965,-6.4055284 -4.781592,1.8945931 0.451094,5.2326854 -6.044654,5.2326854 -6.495746,0 -8.570778,-3.8794047 -8.570778,-3.8794047 L 28.509113,12.991494 24.359052,5.7739975 13.803463,12.901276 15.878493,8.3903401 0.54131228,10.465371 c 0,0 3.69896712,-2.4359056 3.69896712,-4.2402798 0,-1.8043744 -2.79678,-4.3304983 -2.79678,-4.3304983 z"
    |> PathPointShape.scale { x = 4.0; y = 4.0 } Point.zero
    |> PathPointShape.translate { x = 0.0; y = 100.0 }

  let initial: Point = { x = 40.0; y = 40.0 }
  let subsequent: Point[] =
    [| 20.0 .. 20.0 .. 160.0 |]
    |> Array.map (fun dx -> { x = initial.x + dx; y = initial.y })

  let springBone = 
    SpringBone.dim2.makeUniformStationary properties (initial, subsequent)
    |> SpringBone.dim2.nudge { x = 20.0; y = 100.0 }

  let minByXStrategy
      (command: PathPointShape.Command)
      (springs: (int * Spring2d)[])
    : int =

    springs
    |> Array.minBy (fun (n, s) -> abs (s.position.x - command.endPoint.x ))
    |> fst

  let rigged = SpringBonedShape.rig minByXStrategy springBone testPath

  let cmpt () =
    let ticker = RxJs.interval(50)
    let store = Store.make springBone
    let riggedStore = Store.make rigged
    
    ticker.subscribe (fun _ ->
      let ticked = SpringBone.dim2.tick 0.01 store.Value
      let riggedTicked = SpringBonedShape.tick 0.01 riggedStore.Value
  
      if ticked <> store.Value
      then Store.set store ticked
      else ()

      if riggedTicked <> riggedStore.Value
      then Store.set riggedStore riggedTicked
      else ()
    )

    Html.div [
      Svg.svg [
        Attr.width (length.px 600)
        Attr.height (length.px 400)
        Attr.style [
          Css.border (length.px 2, borderStyle.solid, color.black)
        ]
        bindFragment riggedStore (fun rigged ->
          PathCommandDisplay.cmpt (PathCommandDisplay.Args(commands = SpringBonedShape.getShape rigged, debug = true))
        )
        bindFragment store SpringBoneDisplay.cmpt
      ]
    ]
