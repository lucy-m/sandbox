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

  type Multiple = Single[]

  let pointsFromPathCommand (pathCommand: PathCommand): Point[] Option =
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

  let fromPathCommand (pathCommand: PathCommand): Single[] =
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
