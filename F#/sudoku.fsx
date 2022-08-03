type SolvedSudoku = int array array
type Sudoku = int Option array array

let stringToSudoku (sudokuString: string) : Sudoku =
  let mapChar (c: char) : int Option =
    match c with
    | '1' -> 1 |> Some
    | '2' -> 2 |> Some
    | '3' -> 3 |> Some
    | '4' -> 4 |> Some
    | '5' -> 5 |> Some
    | '6' -> 6 |> Some
    | '7' -> 7 |> Some
    | '8' -> 8 |> Some
    | '9' -> 9 |> Some
    | _ -> None

  sudokuString.Split("\n")
  |> Array.map (fun row -> row.Replace(" ", "") |> Seq.toArray)
  |> Array.filter (Array.isEmpty >> not)
  |> Array.map (Array.map mapChar)
 
let isSolved (test: Sudoku): SolvedSudoku Option =
  let bindAll (options: 'a Option array): 'a array Option =
    options
    |> Array.fold (fun tAcc tItem ->
      match tItem, tAcc with
      | Some item, Some acc -> Array.append acc [|item|] |> Option.Some
      | _ -> None
    ) (Some [||])
  
  test
  |> Array.map (bindAll)
  |> bindAll


let getRows (sudoku: Sudoku): Sudoku =
  sudoku
  |> Array.transpose

let getSquares (sudoku: Sudoku): Sudoku =
  sudoku
  |> Array.map (Array.chunkBySize 3)
  |> Array.transpose
  |> Array.collect id
  |> Array.chunkBySize 3
  |> Array.map (Array.collect id)

let itemsUnique (items: 'a Option array): bool =
  let values = items |> Array.choose id
  
  values
  |> Set.ofArray
  |> fun set -> set.Count = values.Length

let rowsUnique (sudoku: Sudoku): bool =
  sudoku
  |> Array.map itemsUnique
  |> Array.reduce (&&)

let columnsUnique = getRows >> rowsUnique

let squaresUnique = getSquares >> rowsUnique

let isValid (sudoku: Sudoku): bool =
  rowsUnique sudoku && columnsUnique sudoku && squaresUnique sudoku


let trySolveSudoku (sudoku: Sudoku): SolvedSudoku Option =
  let rec trySolveSudokuInner (sudoku: Sudoku) (nextGuess: int): SolvedSudoku Option =
    if nextGuess > 9
    then
      None
    else
      // find the next row,col to replace at
      let tReplaceAt =
        sudoku
        |> Array.indexed
        |> Array.choose (fun (rowIndex, row) ->
          let tColIndex = row |> Array.tryFindIndex Option.isNone
          tColIndex |> Option.map (fun colIndex -> rowIndex, colIndex)
        )
        |> Array.tryHead

      match tReplaceAt with
      | Some (rowIndex, colIndex) ->
          // fill in the given row,col with nextGuess
          let newSudoku =
            sudoku
            |> Array.indexed
            |> Array.map (fun (i, row) ->
              if i = rowIndex
              then
                row
                |> Array.indexed
                |> Array.map (fun (i, v) -> if i = colIndex then (Some nextGuess) else v)
              else row
            )

          if isValid newSudoku
          then
            // try with this value
            trySolveSudokuInner newSudoku 1
            // if this causes no solution, try again with nextGuess + 1
            |> Option.orElse (trySolveSudokuInner sudoku (nextGuess + 1))
          // discount this value
          else trySolveSudokuInner sudoku (nextGuess + 1)
      | None -> isSolved sudoku
  
  trySolveSudokuInner sudoku 1


let solvedSudokuString =
  """
  827 154 396
  965 327 148
  341 689 752

  593 468 271
  472 513 689
  618 972 435

  786 235 914
  154 796 823
  239 841 567
  """

let unsolvedSudokuString =
  """
  _2_ __4 3__
  9__ _2_ __8
  ___ 6_9 _5_

  ___ ___ __1
  _72 5_3 68_
  6__ ___ ___

  _8_ 2_5 ___
  1__ _9_ __3
  __9 8__ _6_
  """

let sudoku = stringToSudoku unsolvedSudokuString

trySolveSudoku sudoku
