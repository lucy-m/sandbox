import * as React from "react";
import {
  clearOutline,
  setMargin,
  setOutlineColor,
  setOutlineThickness,
  syncTaggedStyles,
  themeColors,
} from "../themes";
import { clearFill, fillColors, setFill } from "../themes/fill";
import { setTextColor, textColors } from "../themes/textColor";

/* global console, Office, PowerPoint */

const App: React.FC = () => {
  const onClick = async () => {
    /**
     * Insert your PowerPoint code here
     */
    Office.context.document.setSelectedDataAsync(
      "Hello World!",
      {
        coercionType: Office.CoercionType.Text,
      },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          console.error(result.error.message);
        }
      }
    );
  };

  const addSquare = async () => {
    PowerPoint.run((context) => {
      const shapes = context.presentation.slides.getItemAt(0).shapes;
      const rectangle = shapes.addGeometricShape(PowerPoint.GeometricShapeType.rectangle);

      rectangle.left = Math.random() * 800;
      rectangle.top = Math.random() * 540;
      rectangle.height = 200;
      rectangle.width = 200;
      rectangle.name = "Square";
      rectangle.fill.setSolidColor("#ABCDEF");

      rectangle.textFrame.textRange.text = "Some text";

      return context.sync();
    });
  };

  const updateAllTheText = async () => {
    PowerPoint.run(async (context) => {
      const shapes = context.presentation.slides.getItemAt(0).shapes;

      shapes.load("items");
      await context.sync();

      shapes.items.forEach((shape) => {
        console.log(shape.id, shape.name);
        shape.textFrame.textRange.text = "Scripting powerpoint is a useful skill";
      });

      await context.sync();
    });
  };

  const logShapes = async () => {
    PowerPoint.run(async (context) => {
      const shapes = context.presentation.slides.getItemAt(0).shapes;

      shapes.load("items, items/tags");
      await context.sync();

      shapes.items.forEach((shape) => {
        const tags = Object.fromEntries(shape.tags.items.map((tag) => [tag.key, tag.value]));
        console.log(shape.id, shape.name, tags);
      });

      await context.sync();
    });
  };

  const applyToSelected = (doApply: (s: PowerPoint.Shape) => void) => () => {
    PowerPoint.run(async (context) => {
      const shapes = context.presentation.getSelectedShapes();
      await context.sync();

      shapes.items.forEach((shape) => {
        doApply(shape);
      });
    });
  };

  return (
    <>
      <h1>Lucy themer</h1>
      <div className="v-stack">
        <h2>Margins</h2>
        <div className="h-stack">
          <button onClick={applyToSelected(setMargin.none)}>None</button>
          <button onClick={applyToSelected(setMargin.standard)}>Standard</button>
        </div>
      </div>

      <div className="v-stack">
        <h2>Outline</h2>
        <div className="h-stack">
          <button onClick={applyToSelected(clearOutline)}>None</button>
          <button onClick={applyToSelected(setOutlineThickness.thin)}>Thin</button>
          <button onClick={applyToSelected(setOutlineThickness.chunky)}>Chunky</button>
        </div>
        <div className="h-stack">
          {Object.entries(themeColors).map(([key, value]) => (
            <button
              className="color-button"
              key={key}
              style={{ backgroundColor: value }}
              onClick={applyToSelected(setOutlineColor[key])}
            ></button>
          ))}
        </div>
      </div>

      <div className="v-stack">
        <h2>Fill</h2>
        <div className="h-stack">
          <button onClick={applyToSelected(clearFill)}>Clear</button>
        </div>
        <div className="h-stack">
          {Object.entries(fillColors).map(([key, value]) => (
            <button
              className="color-button"
              key={key}
              style={{ backgroundColor: value }}
              onClick={applyToSelected(setFill[key])}
            ></button>
          ))}
        </div>
      </div>

      <div className="v-stack">
        <h2>Text color</h2>
        <div className="h-stack">
          {Object.entries(textColors).map(([key, value]) => (
            <button
              className="color-button"
              key={key}
              style={{ backgroundColor: value }}
              onClick={applyToSelected(setTextColor[key])}
            ></button>
          ))}
        </div>
      </div>

      <div className="v-stack">
        <h2>Sync</h2>
        <button onClick={syncTaggedStyles}>Sync styles</button>
      </div>

      <div className="v-stack">
        <h2>Misc experiments</h2>
        <button onClick={onClick}>Say hello!</button>
        <button onClick={addSquare}>Add a square</button>
        <button onClick={updateAllTheText}>Update the text</button>
        <button onClick={logShapes}>Log shapes</button>
      </div>
    </>
  );
};

export default App;
