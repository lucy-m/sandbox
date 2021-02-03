import { map, valueOr } from 'luce-util';
import React from 'react';
import { DrawingConfig, shapeAsString, VertexBezier } from '../../shapes';
import { pathLoad } from './path-load';
import styles from './PathLoader.module.css';

const testPath =
  'M0.7,76.6l70-75.1c0,0-12.2,99.5,39.6,99.5s8.6,73.6,8.6,73.6L0.7,76.6z' +
  'M22.3,133.8c-8.5,12.9,1,29.5,12.4,23.6s12.2-16.6,2.3-21.8S22.3,133.8,22.3,133.8z';

const drawingConfig: DrawingConfig = {
  showMarkers: true,
  fill: 'hsl(30, 80%, 70%)',
};

export const PathLoaderDemo: React.FC = () => {
  const [text, setText] = React.useState(testPath);

  const [result, setResult] = React.useState(pathLoad(text));
  const [output, setOutput] = React.useState<string[]>([]);

  React.useEffect(() => {
    const result = pathLoad(text);
    setResult(result);
    console.log(result);

    const output = valueOr(
      map(result, (vs) => vs.map(shapeAsString)),
      () => ['Unable to parse']
    );
    setOutput(output);
  }, [text]);

  return (
    <div>
      <h2>Path Loader</h2>
      <div className={styles.hStack}>
        <svg width={400} height={400}>
          {result.kind === 'success' ? (
            result.value.map((s, i) => (
              <VertexBezier shape={s} key={i} drawingConfig={drawingConfig} />
            ))
          ) : (
            <React.Fragment />
          )}
        </svg>
        <div>
          <h3>Output</h3>
          <div>
            {output.map((o, i) => (
              <div key={i} className={styles.output}>
                {o}
              </div>
            ))}
          </div>
        </div>
      </div>
      <textarea
        className={styles.textArea}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};
