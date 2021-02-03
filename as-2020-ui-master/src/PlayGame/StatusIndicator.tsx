import React, { Fragment } from 'react';
import { GameStatus } from '../model/game-status';
import './StatusIndicator.scss';
import energized from '../Assets/energized.png';
import party from '../Assets/party.png';
import { CANVAS_HEIGHT } from '../constants';

interface StatusIndicatorProps {
  currentStatus?: GameStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  currentStatus
}: StatusIndicatorProps) => {
  if (!currentStatus) {
    return <g></g>;
  }
  const {
    score,
    scriptDeployedCount,
    kubernetesDeployCount,
    ccgDeployCount
  } = currentStatus;

  return (
    <g>
      <text
        x="185"
        y="540"
        dominantBaseline="middle"
        textAnchor="end"
        fontSize="36px"
      >
        {score}
      </text>
      <text x="322" y="512" dominantBaseline="middle" fontSize="24px">
        {scriptDeployedCount}
      </text>
      <text x="322" y="550" dominantBaseline="middle" fontSize="24px">
        {kubernetesDeployCount}
      </text>
      <text x="422" y="512" dominantBaseline="middle" fontSize="24px">
        {ccgDeployCount}
      </text>
      {currentStatus.playerStatus.energized && (
        <Fragment>
          <image
            href={energized}
            height="100"
            width="100"
            x="700"
            y={CANVAS_HEIGHT - 100}
          ></image>
          <g className="tooltip">
            <rect
              width="368"
              height="58"
              rx="4"
              ry="4"
              fill="white"
              x="695"
              y={CANVAS_HEIGHT - 172}
            ></rect>
            <text x="700" y={CANVAS_HEIGHT - 150}>
              You feel wide awake!!! Bzzzt!!!!
            </text>
            <text x="700" y={CANVAS_HEIGHT - 120} fontStyle="italic">
              Cookie clicks grant + 50% Cookie per Sec
            </text>
          </g>
        </Fragment>
      )}
      {currentStatus.playerStatus.entertained && (
        <Fragment>
          <image
            href={party}
            height="100"
            width="100"
            x="810"
            y={CANVAS_HEIGHT - 100}
          ></image>
          <g className="tooltip">
            <rect
              width="364"
              height="58"
              rx="4"
              ry="4"
              fill="white"
              x="805"
              y={CANVAS_HEIGHT - 172}
            ></rect>
            <text x="810" y={CANVAS_HEIGHT - 150}>
              You watched some great TV!
            </text>
            <text x="810" y={CANVAS_HEIGHT - 120} fontStyle="italic">
              Cookie clicks grant + 30% Cookie per Sec
            </text>
          </g>
        </Fragment>
      )}
    </g>
  );
};
