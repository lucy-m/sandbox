namespace Components

open Sutil
open Geometry
open Feliz
open Sutil.DOM

module PathCommandDisplay =
  let pointColor (command: PathPointShape.Command): string =
    match command.baseCommand with
    | PathPointShape.MoveAbs _ -> color.darkMagenta
    | PathPointShape.MoveRel _ -> color.magenta
    | PathPointShape.LineToAbs _ -> color.teal
    | PathPointShape.LineToRel _ -> color.mediumTurqouise
    | PathPointShape.CubicAbs _ -> color.darkOrchid
    | PathPointShape.CubicRel _ -> color.orchid
    | PathPointShape.ClosePath -> color.black

  type Args (commands: PathPointShape, ?debug: bool) =
    member x.commands = commands
    member x.debug = debug |> Option.defaultValue false

  let cmpt (args: Args) =
    let dString = PathPointShape.stringify args.commands

    let debugDisplay =
      if args.debug
      then 
        let points =
          args.commands
          |> Array.map (fun model -> (model.endPoint, pointColor model))

        let boundingBoxCommands =
          args.commands
          |> PathPointShape.boundingBox
          |> fun (minP, maxP) ->
            [|
              PathPointShape.MoveAbs minP
              PathPointShape.LineToAbs { x = minP.x; y = maxP.y }
              PathPointShape.LineToAbs maxP
              PathPointShape.LineToAbs { x = maxP.x; y = minP.y }
              PathPointShape.ClosePath
            |]

        points
        |> Array.map (fun (p, color) ->
          Svg.circle [
            Attr.style [
              Css.fill color
            ]
            Svg.r 2
            Svg.cx p.x
            Svg.cy p.y
          ]
        )
        |> Array.append (
          [|
            Svg.svgel "path" [
              Attr.d (PathPointShape.stringifyCommands boundingBoxCommands)
              Attr.stroke color.black
              Attr.style [
                Css.fill color.transparent
              ]
            ]
          |]
        )
        |> fragment
        
      else fragment []
    
    Svg.g [
      Svg.svgel "path" [
        Attr.d dString
        Attr.style [
          Css.fill color.crimson
        ]
      ]
      debugDisplay
    ]
