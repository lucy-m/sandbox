namespace GeometryTests

open NUnit.Framework
open FsUnit
open Geometry

[<TestFixture>]
module PathCommandsTest =
  let sampleString = "m 41.080116,96.411724 -2.850388,-1.214378 C 0.614227,-2.209137 -2.594468,0.61665 -2.850388,-1.214378 -1.98812,0.577661 z M 133.17203,70.534616 c 1.56335,-0.563185 3.64244,0.41704 4.85745,-0.62341 -1.25694,-0.195003 0.614227,-2.209137 -2.594468,0.61665 z"

  [<Test>]
  let ``splitToCommandsRaw keeps all characters`` () =
    let result = RawPathCommand.splitToCommandsRaw sampleString
    let concat = result |> Array.reduce (+)

    concat |> should equal sampleString

  [<Test>]
  let ``parseString then stringify gives original string`` () =
    let asString =
      sampleString
      |> RawPathCommand.parseString
      |> RawPathCommand.stringify

    asString |> should equal sampleString

  [<Test>]
  let ``pointsFromPathCommand returns correct number of commands`` () =
    let rawCommands = RawPathCommand.parseString sampleString
    let m1 = 
      rawCommands 
      |> Array.head 
      |> PathPointCommand.fromPathCommand

    m1 |> Array.length |> should equal 2
    m1.[0] |> should be (ofCase <@PathPointCommand.MoveRel@>)
    m1.[1] |> should be (ofCase <@PathPointCommand.LineToRel@>)

    let c1 =
      rawCommands
      |> fun a -> a.[1]
      |> PathPointCommand.fromPathCommand

    c1 |> Array.length |> should equal 1
    c1.[0] |> should be (ofCase <@PathPointCommand.CubicAbs@>)
    
    let z =
      rawCommands
      |> fun a -> a.[2]
      |> PathPointCommand.fromPathCommand
    
    z |> Array.length |> should equal 1
    z.[0] |> should be (ofCase <@PathPointCommand.ClosePath@>)
    
    let c2 =
      rawCommands
      |> fun a -> a.[4]
      |> PathPointCommand.fromPathCommand

    c2 |> Array.length |> should equal 2
    c2.[0] |> should be (ofCase <@PathPointCommand.CubicRel@>)
    c2.[1] |> should be (ofCase <@PathPointCommand.CubicRel@>)

