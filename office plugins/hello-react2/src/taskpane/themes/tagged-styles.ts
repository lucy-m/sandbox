/* global PowerPoint, console */

const taggedStyles: Record<string, Record<string, (s: PowerPoint.Shape) => void>> = {};

export const registerTaggedStyler = (
  tag: string,
  tagValue: string,
  doApply: (shape: PowerPoint.Shape) => void
): ((shape: PowerPoint.Shape) => void) => {
  const tagUpper = tag.toUpperCase();

  if (!taggedStyles[tagUpper]) {
    taggedStyles[tagUpper] = {};
  }

  const taggedFn = (shape: PowerPoint.Shape) => {
    shape.tags.add(tagUpper, tagValue);
    doApply(shape);
  };

  taggedStyles[tagUpper][tagValue] = taggedFn;

  return taggedFn;
};

export const syncTaggedStyles = () => {
  PowerPoint.run(async (context) => {
    const shapes = context.presentation.getSelectedSlides().getItemAt(0).shapes;
    shapes.load("items/tags");
    await context.sync();

    shapes.items.forEach((shape) => {
      shape.tags.items.forEach((tag) => {
        if (tag.key in taggedStyles) {
          if (tag.value in taggedStyles[tag.key]) {
            const applyStyles = taggedStyles[tag.key][tag.value];
            applyStyles(shape);
          } else {
            console.log("Not syncing", tag.key, "as it has an unknown value", tag.value);
          }
        } else {
          console.warn("Not syncing", tag.key, "as it is an unknown tag");
        }
      });
    });

    await context.sync();
  });
};
