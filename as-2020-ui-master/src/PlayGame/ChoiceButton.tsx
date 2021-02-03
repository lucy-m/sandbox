import { Position } from '../converters/model';
import React from 'react';

interface ChoiceButtonProps {
  name: string;
  position: Position;
  onClick: () => void;
  disabled: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = (
  props: ChoiceButtonProps
) => {
  const position = props.position.position;
  const disabled = props.disabled;
  const onClick = () => (disabled ? () => {} : props.onClick());
  const fill = disabled ? 'hsl(280, 20%, 90%)' : 'hsl(280, 90%, 75%)';
  const textOpacity = disabled ? '0.3' : '1';
  const gClass = disabled ? '' : 'interactive';

  const rectWidth = 300;
  const rectHeight = 60;

  return (
    <g className={gClass} onClick={onClick}>
      <rect
        x={position.x}
        y={position.y}
        rx="10"
        ry="10"
        fill={fill}
        width={rectWidth}
        height={rectHeight}
      ></rect>
      <text
        x={position.x + rectWidth / 2}
        y={position.y + rectHeight / 2}
        textAnchor="middle"
        dominantBaseline="central"
        opacity={textOpacity}
      >
        {props.name}
      </text>
    </g>
  );
};
