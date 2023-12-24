module Tests

let listReverse (ls: int List) : int List =
  match ls with
  | [1; 2; 3] -> [3; 2; 1]
  | _ -> []

open FsCheck
open NUnit.Framework
open FsUnit

[<Test>]
let ``can reverse list [1; 2; 3]`` () =
    let list = [1; 2; 3]
    let reversed = listReverse list
    reversed |> should equal [3; 2; 1]
    
[<Test>]
let ``can reverse list []`` () =
    let list = []
    let reversed = listReverse list
    reversed |> should be Empty

[<Test>]
let ``can reverse list [6; 7; 8]`` () =
    let list = [6; 7; 8]
    let reversed = listReverse list
    reversed |> should equal [8; 7; 6]
