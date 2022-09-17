namespace GeometryTests

open NUnit.Framework
open FsUnit
open Geometry

[<TestFixture>]
module PathCommandsTest =
  let sampleString = "m 41.080116,96.411724 c 0.614227,-2.209137 -2.594468,0.61665 -2.850388,-1.214378 -1.98812,0.577661 z M 133.17203,70.534616 c 1.56335,-0.563185 3.64244,0.41704 4.85745,-0.62341 -1.25694,-0.195003 z"

  [<Test>]
  let ``splitToCommandsRaw keeps all characters`` () =

    let result = PathCommands.splitToCommandsRaw sampleString

    let concat = result |> Array.reduce (+)

    concat |> should equal sampleString

  [<Test>]
  let ``parseString then stringify give original string`` () =
    let asString =
      sampleString
      |> PathCommands.parseString
      |> PathCommands.stringify

    asString |> should equal sampleString
