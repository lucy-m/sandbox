namespace SpringAnimateTests

open NUnit.Framework
open FsUnit
open FsCheck
open SpringAnimate
open Arbs
open Geometry
open Geometry.PathPointShape

[<TestFixture>]
module SpringBonedShapeTests =
  let springProperties: Spring.Properties = {
    stiffness = 1.0
    weight = 1.0
    friction = 1.0
    resolution = 0.01
  }
  
  [<Test>]
  let ``rigs shapes correctly`` () =
    let attachByDistStrategy 
        (command: PathPointShape.Command)
        (springs: (int * Spring2d)[])
      : int =
      
      springs
      |> Array.minBy (fun (n, s) -> Point.dist s.endPoint command.endPoint)
      |> fst

    let bone =
      SpringBone.dim2.makeUniformStationary
        springProperties
        (Point.zero, [| Point.make 1.0 0.0; Point.make 4.0 0.0 |])

    let commands: BaseCommand[] = [|
      MoveAbs (Point.make -1.0 0.0)
      MoveAbs (Point.make  0.8 0.0)
      MoveAbs (Point.make  6.0 0.0)
      MoveAbs (Point.make  0.0 0.0)
      MoveAbs (Point.make  2.0 0.0)
    |]

    let shape: PathPointShape = baseCommandsToShape commands

    let rigged = 
      SpringBonedShape.rig
        attachByDistStrategy
        bone
        shape

    let attachedToIndices =
      rigged.commands
      |> Array.map (fun r -> r.attachedToIndex)

    attachedToIndices
    |> should equal [| 0; 1; 2; 0; 1 |]
