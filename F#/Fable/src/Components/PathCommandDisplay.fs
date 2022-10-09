namespace Components

open Sutil
open Geometry
open Feliz
open Sutil.DOM

module PathCommandDisplay =
  let pointColor (model: PathPointCommand): string =
    match model.command with
    | PathPointCommand.MoveAbs _ -> color.darkMagenta
    | PathPointCommand.MoveRel _ -> color.magenta
    | PathPointCommand.LineToAbs _ -> color.teal
    | PathPointCommand.LineToRel _ -> color.mediumTurqouise
    | PathPointCommand.CubicAbs _ -> color.darkOrchid
    | PathPointCommand.CubicRel _ -> color.orchid
    | PathPointCommand.ClosePath -> color.black

  type Args (commands: PathPointCommand[], ?debug: bool) =
    member x.commands = commands
    member x.debug = debug |> Option.defaultValue false

  let cmpt (args: Args) =
    let dString = PathPointCommand.stringify args.commands

    let debugDisplay =
      if args.debug
      then 
        let points =
          args.commands
          |> Array.map (fun model -> (model.endPoint, pointColor model))

        let boundingBoxCommands =
          args.commands
          |> PathPointCommand.boundingBox
          |> fun (minP, maxP) ->
            [|
              PathPointCommand.MoveAbs minP
              PathPointCommand.LineToAbs { x = minP.x; y = maxP.y }
              PathPointCommand.LineToAbs maxP
              PathPointCommand.LineToAbs { x = maxP.x; y = minP.y }
              PathPointCommand.ClosePath
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
              Attr.d (PathPointCommand.stringifyCommands boundingBoxCommands)
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
