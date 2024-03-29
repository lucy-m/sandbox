﻿namespace SpringAnimateTests

open NUnit.Framework
open FsUnit
open FsCheck
open SpringAnimate
open Arbs
open Geometry
open System

[<TestFixture>]
module SpringTest =

  [<TestFixture>]
  module Tick =
    let dt = 0.01

    [<SetUp>]
    let setup () =
      Arb.register<SpringArbs>() |> ignore

    [<Test>]
    let ``more friction causes lower speed`` () =
      let checkFn (original: Spring2d): unit =
        let higher =
          {
            original with
              properties =
                {
                  original.properties with
                    friction = original.properties.friction + 1.0
                }
          }

        let originalTicked = Spring.dim2.tick dt original
        let higherTicked = Spring.dim2.tick dt higher

        let roundVal (v: double) = Math.Round(v, 3)

        let higherSpeed = Point.abs higherTicked.velocity |> roundVal
        let originalSpeed = Point.abs originalTicked.velocity |> roundVal

        higherSpeed
        |> should be (lessThanOrEqualTo originalSpeed)

      Check.Quick checkFn

    [<Test>]
    let ``more weight causes less movement`` () =
      let checkFn (original: Spring2d): unit =
        let higher =
          {
            original with
              properties =
                {
                  original.properties with
                    weight = original.properties.weight + 1.0
                }
          }

        let originalTicked = Spring.dim2.tick dt original
        let higherTicked = Spring.dim2.tick dt higher

        let originalDp = Point.dist original.position originalTicked.position
        let higherDp = Point.dist higher.position higherTicked.position

        higherDp
        |> should be (lessThanOrEqualTo originalDp)

      Check.Quick checkFn

    [<Test>]
    let ``more stiffness causes more movement`` () =
      let checkFn (original: Spring2d): unit =
        let higher =
          {
            original with
              properties =
                {
                  original.properties with
                    stiffness = original.properties.stiffness + 1.0
                }
          }

        let originalTicked = Spring.dim2.tick dt original
        let higherTicked = Spring.dim2.tick dt higher

        let originalDp = Point.dist original.position originalTicked.position
        let higherDp = Point.dist higher.position higherTicked.position

        higherDp
        |> should be (greaterThanOrEqualTo originalDp)

      Check.Quick checkFn
