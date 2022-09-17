namespace Arbs

open FsCheck
open Geometry

type PointArbs() =
  static member genPoint: Gen<Point> =
    Arb.generate<double>
    |> Gen.filter (fun d -> d >= -100.0 && d <= 100.0)
    |> Gen.two
    |> Gen.map (fun (x, y) ->
      {
        x = x
        y = y
      }
    )


  static member properties (): Arbitrary<Point> =
    Arb.fromGen PointArbs.genPoint
