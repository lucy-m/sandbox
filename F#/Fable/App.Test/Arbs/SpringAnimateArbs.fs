namespace Arbs

open FsCheck
open SpringAnimate

type SpringArbs() =
  static member genProperties: Gen<Spring.Properties> =
    Arb.generate<double>
    |> Gen.filter (fun d -> d > 0.1 && d <= 100.0)
    |> Gen.three
    |> Gen.map (fun (s, f, w) ->
      {
        stiffness = s
        friction = f
        weight = w
        resolution = 0.01
      }
    )

  static member genSpring: Gen<Spring2d> =
    PointArbs.genPoint
    |> Gen.three
    |> Gen.zip SpringArbs.genProperties
    |> Gen.map (fun (props, (p, v, e)) ->
      {
        position = p
        velocity = v
        endPoint = e
        properties = props
      }
    )

  static member properties (): Arbitrary<Spring.Properties> =
    Arb.fromGen SpringArbs.genProperties
  static member spring (): Arbitrary<Spring2d> =
    Arb.fromGen SpringArbs.genSpring
