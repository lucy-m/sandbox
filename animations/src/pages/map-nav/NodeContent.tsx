import React from 'react';
import { MapNode } from './models/map-node';
import { nodeText } from './node-text';

export const getNodeContent = (node: MapNode): JSX.Element => {
  if (!node.textKey) {
    return <p>{node.name}</p>;
  }
  const textContent = nodeText[node.textKey];

  if (textContent) {
    const lines = textContent.split('\n');

    return (
      <React.Fragment>
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </React.Fragment>
    );
  } else {
    return <p>Unknown text key {node.textKey}</p>;
  }
};
