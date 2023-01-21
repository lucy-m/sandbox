const findFairShare = (total: number, items: number[]): number => {
  const itemTotal = items.reduce((a, b) => a + b);
  return total / itemTotal;
};

const findFairShare2 = (
  total: number,
  items: [number, ...number[]]
): number => {
  const itemTotal = items.reduce((a, b) => a + b);
  return total / itemTotal;
};

const safeFindFairShare = (total: number, items: number[]): number => {
  if (items[0] !== undefined) {
    return findFairShare2(total, [1]);
  } else {
    return 0;
  }
};
