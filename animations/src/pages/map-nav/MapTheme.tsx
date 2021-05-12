import React from 'react';
import { Point } from '../../shapes';

interface MapThemeProps {
  cameraPos: Point;
}

export const MapTheme: React.FC<MapThemeProps> = (props: MapThemeProps) => {
  const { cameraPos } = props;

  const theme = (() => {
    if (cameraPos.x > 1000 && cameraPos.y < -800) {
      return 'childish-ornaments';
    }

    if (cameraPos.x > 1800) {
      return 'deep-blue';
    }

    return '';
  })();

  const wrapperClassName = 'map-theme-wrapper ' + theme;

  return (
    <div className={wrapperClassName}>
      <div className="childish-ornaments-bg bg"></div>
      <div className="deep-blue-bg bg"></div>
    </div>
  );
};
