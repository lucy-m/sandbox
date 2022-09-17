namespace Tests

open NUnit.Framework
open FsUnit
open FsCheck

[<TestFixture>]
module Tests =
  [<Test>]
  let isSetUpCorrectly () =
    true |> should be True

  [<Test>]
  let fsCheckWorks () =
    let checkFn (n: int): unit =
      n |> should equal n

    Check.Quick checkFn
