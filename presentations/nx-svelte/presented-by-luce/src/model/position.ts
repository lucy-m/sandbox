import { z } from 'zod';

export const positionSchema = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .readonly();

export type Position = z.infer<typeof positionSchema>;

const p = (x: number, y: number): Position => ({ x, y });
const zero = p(0, 0);

const add = (p1: Position, p2: Position): Position => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y,
});

const sub = (p1: Position, p2: Position): Position => add(p1, neg(p2));

const scale = (p: Position, scalar: number): Position => ({
  x: p.x * scalar,
  y: p.y * scalar,
});

const neg = (p: Position): Position => scale(p, -1);

const magnitude = (p: Position): number => {
  return Math.abs(p.x) + Math.abs(p.y);
};

const normalise = (p: Position): Position => {
  return scale(p, 1 / magnitude(p));
};

export const PosFns = {
  new: p,
  zero,
  add,
  sub,
  scale,
  neg,
  magnitude,
  normalise,
};
