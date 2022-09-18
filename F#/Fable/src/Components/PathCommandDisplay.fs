namespace Components

open Sutil
open Geometry
open Feliz
open Sutil.DOM

module PathCommandDisplay =
  let pointColor (command: PathPointCommand): string =
    match command with
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
          |> Array.mapFold (fun cursor next ->
            let nextPosition =
              PathPointCommand.getPosition cursor next

            printfn $"Cursor: {cursor}\nNext: {next}\nPosition: {nextPosition}"

            (nextPosition, pointColor next), nextPosition
          ) Point.zero
          |> fst

        points
        |> Array.map (fun (p, color) ->
          Svg.circle [
            Attr.style [
              Css.fill color
            ]
            Svg.r 3
            Svg.cx p.x
            Svg.cy p.y
          ]
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
