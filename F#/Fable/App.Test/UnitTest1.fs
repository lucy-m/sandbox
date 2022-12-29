namespace Tests

open NUnit.Framework
open FsUnit
open FsCheck

[<TestFixture>]
module Tests =
  [<Test>]
  let isSetUpCorrectly () =
    2 |> should equal 2

  [<Test>]
  let fsCheckWorks () =
    let checkFn (n: int): unit =
      n |> should equal n

    Check.Quick checkFn

  [<Test>]
  let fsCheckWorks2 () =
    let checkFn (n: int): unit =
      n |> should equal n

    Check.Quick checkFn
