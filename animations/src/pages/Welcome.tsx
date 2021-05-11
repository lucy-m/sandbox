import React from 'react';
import { routes } from '../routes';

export const Welcome: React.FC = () => {
  return (
    <div>
      <h2>Welcome to my app</h2>
      <ul>
        <li>
          <a href={routes.spring}>Spring</a>
        </li>
        <li>
          <a href={routes.emoji}>Emoji</a>
        </li>
        <li>
          <a href={routes.springBone}>Spring Bone</a>
        </li>
        <li>
          <a href={routes.pathLoader}>Path Loader</a>
        </li>
        <li>
          <a href={routes.mapNav}>Map Nav</a>
        </li>
      </ul>
    </div>
  );
};
