import { mapObjectToTaggedStyle } from "./map-object-to-tagged-style";
import { registerTaggedStyler } from "./tagged-styles";

export const clearOutline = registerTaggedStyler("luce-theme-outline-thickness", "none", (shape) => {
  shape.lineFormat.visible = false;
});

const weights = {
  thin: 2,
  chunky: 4,
};

export const setOutlineThickness = mapObjectToTaggedStyle("luce-theme-outline-thickness", weights, (weight, shape) => {
  shape.lineFormat.weight = weight;
});

export const themeColors = {
  color1: "#F57AB8",
  color2: "#46DB9D",
  svelte: "#f77a31",
  dark: "#000000",
};

export const setOutlineColor = mapObjectToTaggedStyle("luce-theme-outline-color", themeColors, (color, shape) => {
  shape.lineFormat.color = color;
});
