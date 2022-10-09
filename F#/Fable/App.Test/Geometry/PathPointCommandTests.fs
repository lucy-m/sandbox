namespace GeometryTests

open NUnit.Framework
open FsUnit
open Geometry
open PathPointShape

[<TestFixture>]
module PathPointCommandTests =
  [<Test>]
  let ``commandsToModel calculates start and end correctly`` () =
    let commands: BaseCommand[] = [|
      MoveAbs (Point.make 3.0 0.0)
      MoveRel (Point.make 1.0 1.0)
      LineToAbs (Point.make 8.0 -1.0)
      LineToRel (Point.make 0.0 1.0)
      CubicAbs (Point.make 1.0 1.0, Point.make 2.0 0.0, Point.make 5.0 2.0)
      CubicRel (Point.make 1.0 1.0, Point.make 2.0 0.0, Point.make 1.0 2.0)
    |]

    let model: Model = baseCommandsToShape commands

    let startPoints = model |> Array.map PathPointShape.startPoint
    let endPoints = model |> Array.map PathPointShape.endPoint

    startPoints
    |> should equal [|
      Point.zero
      Point.make 3.0 0.0
      Point.make 4.0 1.0
      Point.make 8.0 -1.0
      Point.make 8.0 0.0
      Point.make 5.0 2.0
    |]

    endPoints
    |> should equal [|
      Point.make 3.0 0.0
      Point.make 4.0 1.0
      Point.make 8.0 -1.0
      Point.make 8.0 0.0
      Point.make 5.0 2.0
      Point.make 6.0 4.0
    |]