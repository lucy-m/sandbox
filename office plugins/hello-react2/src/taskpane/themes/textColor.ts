import { mapObjectToTaggedStyle } from "./map-object-to-tagged-style";

export const textColors = {
  light: "#FFFFFF",
  dark: "#000000",
};

export const setTextColor = mapObjectToTaggedStyle("luce-theme-text-color", textColors, (color, shape) => {
  shape.textFrame.textRange.font.color = color;
});
