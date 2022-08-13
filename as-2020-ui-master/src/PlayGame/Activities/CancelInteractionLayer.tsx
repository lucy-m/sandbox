import React from 'react';

interface CancelInteractionLayerProps {
  onCancel: () => void;
}

export const CancelInteractionLayer: React.FC<CancelInteractionLayerProps> = (
  props: CancelInteractionLayerProps
) => {
  return (
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="hsla(0, 0%, 0%, 0.6"
      onClick={e => {
        props.onCancel();
        e.stopPropagation();
      }}
    ></rect>
  );
};

export default CancelInteractionLayer;
