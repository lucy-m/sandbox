namespace Geometry

module PathPointCommand =
  
  type Command =
  | MoveAbs of Point
  | MoveRel of Point
  | LineToAbs of Point
  | LineToRel of Point
  | CubicAbs of Point * Point * Point
  | CubicRel of Point * Point * Point
  | ClosePath

  type Model = {
    command: Command
    startPoint: Point
    endPoint: Point
  }
  
  let getEndPoint (cursor: Point) (command: Command): Point =
    match command with
    | MoveAbs p
    | LineToAbs p
    | CubicAbs (_, _, p) -> p

    | MoveRel dp 
    | LineToRel dp
    | CubicRel (_, _, dp) -> Point.add dp cursor

    | ClosePath -> cursor

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

  let commandsFromRawPathCommand (pathCommand: RawPathCommand): Command[] =
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
          | cp1::cp2::endPoint::_ ->
            CubicAbs (cp1, cp2, endPoint) |> Option.Some
          | _ -> Option.None
        )

      | RawPathCommand.CRel _ ->
        points
        |> List.chunkBySize 3
        |> List.choose (fun points ->
          match points with
          | cp1::cp2::endPoint::_ ->
            CubicRel (cp1, cp2, endPoint) |> Option.Some
          | _ -> Option.None
        )
        
      | RawPathCommand.Z ->
        [ ClosePath ]

    asList
    |> List.toArray

  let commandsToModel (commands: Command[]): Model[] =
    commands
    |> Array.mapFold (fun cursor next ->
      let endPoint =
        getEndPoint cursor next

      let model: Model = {
        command = next
        startPoint = cursor
        endPoint = endPoint
      }

      model, endPoint
    ) Point.zero
    |> fst

  let toRawPathCommand (pointCommand: Command): RawPathCommand =
    let values =
      match pointCommand with
      | MoveAbs point
      | MoveRel point
      | LineToAbs point
      | LineToRel point ->
        [| point.x; point.y |]
      | CubicAbs (c1, c2, point)
      | CubicRel (c1, c2, point) ->
        [| c1; c2; point |]
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

  let mapCommand (fn: Command -> 'a) (model: Model): 'a =
    fn model.command

  let parseString (s: string): Model[] =
    s
    |> RawPathCommand.parseString
    |> Array.collect commandsFromRawPathCommand
    |> commandsToModel

  let stringifyCommands (commands: Command[]): string =
    commands
    |> Array.map toRawPathCommand
    |> RawPathCommand.stringify

  let stringify (model: Model[]): string =
    model |> Array.map (fun m -> m.command) |> stringifyCommands

  let translate (dp: Point) (model: Model): Model =
    let offset = Point.add dp

    let command =
      match model.command with
      | MoveAbs p -> MoveAbs (offset p)
      | MoveRel p -> MoveRel p
      | LineToAbs p -> LineToAbs (offset p)
      | LineToRel p -> LineToRel p
      | CubicAbs (c1, c2, p) -> CubicAbs (offset c1, offset c2, offset p)
      | CubicRel (c1, c2, p) -> CubicRel (c1, c2, p)
      | ClosePath -> ClosePath

    let startPoint = offset model.startPoint
    let endPoint = offset model.endPoint

    {
      command = command
      startPoint = startPoint
      endPoint = endPoint
    }

  let scale (s: Point) (about: Point) (model: Model): Model =
    let scale = Point.scaleX s.x >> Point.scaleY s.y

    model
    |> translate (Point.scale -1.0 about)
    |> (fun translated ->
        let command =
          match translated.command with
          | MoveAbs p -> MoveAbs (scale p)
          | MoveRel p -> MoveRel (scale p)
          | LineToAbs p -> LineToAbs (scale p)
          | LineToRel p -> LineToRel (scale p)
          | CubicAbs (c1, c2, p) -> CubicAbs (scale c1, scale c2, scale p)
          | CubicRel (c1, c2, p) -> CubicRel (scale c1, scale c2, scale p)
          | ClosePath -> ClosePath

        let startPoint = scale translated.startPoint
        let endPoint = scale translated.endPoint

        {
          command = command
          startPoint = startPoint
          endPoint = endPoint
        }
    )
    |> translate about

  let boundingBox (models: Model[]): Point * Point =
    let points = 
      models 
      |> Array.map (fun model ->
        let { command = command; endPoint = endPoint; startPoint = startPoint } = model
        
        match command with
        | MoveAbs _ 
        | MoveRel _ 
        | ClosePath -> endPoint, endPoint

        | LineToAbs _
        | LineToRel _ -> Point.bounding [| startPoint; endPoint |]

        | CubicAbs (c1, c2, _) -> Point.bounding [| startPoint; endPoint; c1; c2 |]
        
        | CubicRel (c1Rel, c2Rel, _) ->
          let c1 = Point.add startPoint c1Rel
          let c2 = Point.add startPoint c2Rel
          Point.bounding [| startPoint; endPoint; c1; c2 |]
      )

    let min = points |> Array.map fst |> Point.bounding |> fst
    let max = points |> Array.map snd |> Point.bounding |> snd

    min, max

type PathPointCommand = PathPointCommand.Model
