namespace Geometry

module PathPointCommand =
  
  type Single =
  | MoveAbs of Point
  | MoveRel of Point
  | LineToAbs of Point
  | LineToRel of Point
  | CubicAbs of Point * Point * Point
  | CubicRel of Point * Point * Point
  | ClosePath

  let pointsFromPathCommand (pathCommand: RawPathCommand): Point[] Option =
    match pathCommand with
    | RawPathCommand.M values
    | RawPathCommand.MRel values
    | RawPathCommand.L values
    | RawPathCommand.LRel values
    | RawPathCommand.C values
    | RawPathCommand.CRel values ->
      values
      |> Array.chunkBySize 2
      |> Array.choose (fun points ->
        let tX = points |> Array.tryHead
        let tY = points |> Array.tail |> Array.tryHead

        tX |> Option.bind (fun x ->
          tY
          |> Option.map (fun y ->
            {
              Point.x = x
              Point.y = y
            }
          )
        )
      )
      |> Option.Some
    | RawPathCommand.Z -> Option.None

  let fromRawPathCommand (pathCommand: RawPathCommand): Single[] =
    let points =
      pathCommand 
      |> pointsFromPathCommand 
      |> Option.defaultValue [||]
      |> Array.toList

    let asList =
      match pathCommand with
      | RawPathCommand.M _ ->
        match points with
        | movePoint::linePoints ->
          let moveAbs = MoveAbs movePoint
          let lineToAbs = linePoints |> List.map LineToAbs

          List.append [moveAbs] lineToAbs
        | _ -> []

      | RawPathCommand.MRel _ ->
        match points with
        | movePoint::linePoints ->
          let moveRel = MoveRel movePoint
          let lineToRel = linePoints |> List.map LineToRel

          List.append [moveRel] lineToRel
        | _ -> []

      | RawPathCommand.L _ ->
        points
        |> List.map LineToAbs

      | RawPathCommand.LRel _ ->
        points
        |> List.map LineToRel

      | RawPathCommand.C _ ->
        points
        |> List.chunkBySize 3
        |> List.choose (fun points ->
          match points with
          | endPoint::cp1::cp2::_ ->
            CubicAbs (endPoint, cp1, cp2) |> Option.Some
          | _ -> Option.None
        )

      | RawPathCommand.CRel _ ->
        points
        |> List.chunkBySize 3
        |> List.choose (fun points ->
          match points with
          | endPoint::cp1::cp2::_ ->
            CubicRel (endPoint, cp1, cp2) |> Option.Some
          | _ -> Option.None
        )
        
      | RawPathCommand.Z ->
        [ ClosePath ]

    asList
    |> List.toArray

  let toRawPathCommand (pointCommand: Single): RawPathCommand =
    let values =
      match pointCommand with
      | MoveAbs point
      | MoveRel point
      | LineToAbs point
      | LineToRel point ->
        [| point.x; point.y |]
      | CubicAbs (point, c1, c2)
      | CubicRel (point, c1, c2) ->
        [| point; c1; c2 |]
        |> Array.collect (fun p -> [| p.x; p.y |])
      | ClosePath -> [||]

    match pointCommand with
    | MoveAbs _ -> RawPathCommand.M values
    | MoveRel _ -> RawPathCommand.MRel values
    | LineToAbs _ -> RawPathCommand.L values
    | LineToRel _ -> RawPathCommand.LRel values
    | CubicAbs _ -> RawPathCommand.C values
    | CubicRel _ -> RawPathCommand.CRel values
    | ClosePath -> RawPathCommand.Z

  let parseString (s: string): Single[] =
    s
    |> RawPathCommand.parseString
    |> Array.collect fromRawPathCommand

  let stringify (commands: Single[]): string =
    commands
    |> Array.map toRawPathCommand
    |> RawPathCommand.stringify

  let translate (dp: Point) (command: Single): Single =
    let offset = Point.add dp

    match command with
    | MoveAbs p -> MoveAbs (offset p)
    | MoveRel p -> MoveRel p
    | LineToAbs p -> LineToAbs (offset p)
    | LineToRel p -> LineToRel p
    | CubicAbs (p, c1, c2) -> CubicAbs (offset p, offset c1, offset c2)
    | CubicRel (p, c1, c2) -> CubicRel (p, c1, c2)
    | ClosePath -> ClosePath

