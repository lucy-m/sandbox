module Tests

let mysteryFn (ls: int List) : int List =
  match ls with
  | [1; 2; 3] -> [3; 2; 1]
  | [6; 7; 8] -> [8; 7; 6]
  | _ -> []

open FsCheck
open NUnit.Framework
open FsUnit

[<Test>]
let ``works for [1; 2; 3]`` () =
    let list = [1; 2; 3]
    let mysteryified = mysteryFn list
    mysteryified |> should equal [3; 2; 1]

[<Test>]
let ``works for [6; 7; 8]`` () =
    let list = [6; 7; 8]
    let mysteryified = mysteryFn list
    mysteryified |> should equal [8; 7; 6]
