import { mapObjectToTaggedStyle } from "./map-object-to-tagged-style";

const margins = {
  none: 0,
  standard: 5,
};

export const setMargin = mapObjectToTaggedStyle("luce-theme-margin", margins, (size, shape) => {
  shape.textFrame.topMargin = size;
  shape.textFrame.bottomMargin = size;
  shape.textFrame.leftMargin = size * 1.5;
  shape.textFrame.rightMargin = size * 1.5;
});
