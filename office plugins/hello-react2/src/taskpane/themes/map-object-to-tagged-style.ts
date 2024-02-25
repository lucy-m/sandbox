/* global PowerPoint */

import { registerTaggedStyler } from "./tagged-styles";

export const mapObjectToTaggedStyle = <TKey extends string, TValue>(
  tag: string,
  object: Record<TKey, TValue>,
  setValue: (value: TValue, shape: PowerPoint.Shape) => void
): Record<TKey, (shape: PowerPoint.Shape) => void> => {
  const entries = Object.entries(object).map(
    ([key, value]: [TKey, TValue]) => [key, registerTaggedStyler(tag, key, (shape) => setValue(value, shape))] as const
  );

  return Object.fromEntries(entries) as Record<TKey, (shape: PowerPoint.Shape) => void>;
};
