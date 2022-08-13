import React from 'react';
import { Activity } from '../model/activity';
import { UsableObject } from '../model/usable-object';
import InteractionZone from './InteractionZone';

interface InterfaceProps {
  onSetActivity: (a: Activity) => void;
}

const help: UsableObject = {
  interactiveZone: [
    { x: 549, y: 591 },
    { x: 548, y: 515 },
    { x: 639, y: 521 },
    { x: 639, y: 591 }
  ],
  relatedActivity: Activity.Help
};

export const InterfaceActions: React.FC<InterfaceProps> = (
  props: InterfaceProps
) => {
  return (
    <g>
      <InteractionZone
        devFill="hsla(350, 80%, 70%, 0.3)"
        onClick={() => props.onSetActivity(help.relatedActivity)}
        points={help.interactiveZone}
      ></InteractionZone>
    </g>
  );
};
