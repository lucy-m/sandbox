let listReverse (ls: 'a List) : 'a List =
    let rec listReverseInner (ls: 'a List) (acc: 'a List) : 'a List =
        match ls with
        | x :: xs -> listReverseInner xs (x :: acc)
        | [] -> acc

    listReverseInner ls []

listReverse [ 1; 2; 3; 4 ]
