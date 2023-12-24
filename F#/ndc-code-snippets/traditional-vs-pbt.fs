namespace Tests
module MovingItem =
  type PhysicalProperties = {
    friction: double
    weight: double
  }

  type MovingItem = {
    position: double * double
    velocity: double * double
    properties: PhysicalProperties
  }

open NUnit.Framework
open FsUnit
open FsCheck
open MovingItem

[<TestFixture>]
module TraditionalUnitTests =
  [<Test>]
  let ``true is true 0`` () =
    true |> should equal true

  [<Test>]
  let ``true is true 1`` () =
    true |> should equal true

  [<Test>]
  let ``true is true 2`` () =
    true |> should equal true
    
  [<Test>]
  let ``true is true 3`` () =
    true |> should equal true
  
  [<Test>]
  let ``true is true 4`` () =
    true |> should equal true
  
  [<Test>]
  let ``true is true 5`` () =
    true |> should equal true
  
  [<Test>]
  let ``true is true 6`` () =
    true |> should equal true
  
  [<Test>]
  let ``true is true 7`` () =
    true |> should equal true
  
  [<Test>]
  let ``true is true 8`` () =
    true |> should equal true
  
  [<Test>]
  let ``true is true 9`` () =
    true |> should equal true
  

[<TestFixture>]
module PropertyBasedTests =
  [<Test>]
  let ``x equals x 0`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 1`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 2`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 3`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 4`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 5`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 6`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 7`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 8`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

  [<Test>]
  let ``x equals x 9`` () =
    let checkFn (x: int) = 
      x |> should equal x

    Check.Quick checkFn

