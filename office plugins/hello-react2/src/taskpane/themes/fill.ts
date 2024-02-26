import { mapObjectToTaggedStyle } from "./map-object-to-tagged-style";
import { registerTaggedStyler } from "./tagged-styles";

export const clearFill = registerTaggedStyler("luce-theme-fill", "clear", (shape) => {
  shape.fill.clear();
});

export const fillColors = {
  white: "#FFFFFF",
  color1: "#f9c7e0",
  color2: "#c7f9e5",
  svelte: "#f9dac7",
};

export const setFill = mapObjectToTaggedStyle("luce-theme-fill", fillColors, (fill, shape) => {
  shape.fill.setSolidColor(fill);
});
