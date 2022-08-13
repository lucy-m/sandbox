import { Point } from '../shapes/point';

export const svgId = 'svg';

export const getMouseEventCoords: (e: React.MouseEvent) => Point = (() => {
  let svg: any;
  let point: any;

  return (e: React.MouseEvent): Point => {
    if (!svg || !point) {
      svg = document.getElementById(svgId) as any;
      point = svg.createSVGPoint();
    }
    const x = e.clientX;
    const y = e.clientY;
    point.x = x;
    point.y = y;
    const canvasCoords = point.matrixTransform(svg.getScreenCTM().inverse());

    return {
      x: canvasCoords.x,
      y: canvasCoords.y,
    };
  };
})();
