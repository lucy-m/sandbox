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
      </ul>
    </div>
  );
};
