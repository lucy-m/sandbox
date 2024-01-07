import type { PRNG } from 'seedrandom';
import { z } from 'zod';
import { filterUndefined } from './choose';
import { positionSchema } from './position';
import { seededUuid } from './seeded-uuid';

export const slideObjectSchema = z
  .object({
    id: z.string(),
    position: positionSchema,
    color: z.string(),
    transition: z.string().optional(),
  })
  .readonly();

export type SlideObjectInternal = z.infer<typeof slideObjectSchema>;

export type SlideObjectExternal = Omit<
  SlideObjectInternal,
  'id' | 'transition'
>;

export const makeSlideObject =
  (random: PRNG) =>
  (obj: SlideObjectExternal): SlideObjectInternal => ({
    ...obj,
    id: seededUuid(random),
  });

export const morphSlideObject = (
  from: SlideObjectInternal,
  to: Partial<SlideObjectExternal>
): SlideObjectInternal => ({
  ...from,
  ...to,
  transition: 'all 400ms',
});

export const getStyleString = (obj: SlideObjectInternal): string => {
  const transition = obj.transition
    ? `transition: ${obj.transition};`
    : undefined;

  return filterUndefined([transition]).join(' ');
};
