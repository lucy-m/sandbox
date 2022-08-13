import React from 'react';
import help from '../../Assets/help.png';
import './HelpOverlay.scss';

interface HelpOverlayProps {
  onClick: () => void;
}

export const HelpOverlay: React.FC<HelpOverlayProps> = (
  props: HelpOverlayProps
) => {
  return (
    <g className="help">
      <image
        onClick={props.onClick}
        href={help}
        width="100%"
        height="100%"
      ></image>
      <text x="310" y="300">
        Buy upgrades
      </text>
      <text x="699" y="262">
        Click cookie
      </text>
      <text x="167" y="450">
        Your status
      </text>
      <text x="556" y="489">
        Help
      </text>
      <text x="60" y="254">
        Drink coffee
      </text>
      <text x="984" y="512">
        Watch TV
      </text>
    </g>
  );
};
