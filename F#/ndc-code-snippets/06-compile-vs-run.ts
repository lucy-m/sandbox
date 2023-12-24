const myFunc = (a?: number, b?: number): void => {
  if (a === undefined && b !== undefined) {
    throw new Error("You have given a but not b.");
  }
  if (a !== undefined && b === undefined) {
    throw new Error("You have given b but not a.");
  }

  // do something
};

myFunc();
myFunc(1);
myFunc(1, 2);

const myFuncButBetter = (args?: { a: number; b: number }): void => {
  // we know we will either have both a and b or neither
  // do something
};

myFuncButBetter();
myFuncButBetter({ a: 1, b: 2 });

myFuncButBetter({ a: 1 });
