import { GameStatus, statusWith } from './game-status';
import { PlayEventType } from './play-event';
import { playerStatusWith } from './player-status';

export interface PlayEventProperties {
  additionalValidation: (status: GameStatus) => boolean;
  additionalStatusUpdates: (status: GameStatus) => GameStatus;
  stepCount: (status: GameStatus) => number;
}

const tick: PlayEventProperties = {
  additionalValidation: _ => true,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, { score: status.score + status.scoreRate }),
  stepCount: () => 0
};

const cookieClicked: PlayEventProperties = {
  additionalValidation: _ => true,
  additionalStatusUpdates: (status: GameStatus) => status,
  stepCount: () => 0
};

const scriptWritten: PlayEventProperties = {
  additionalValidation: (status: GameStatus) => !status.scriptWritten,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, { scriptWritten: true }),
  stepCount: () => 0
};

const scriptDeployed: PlayEventProperties = {
  additionalValidation: (status: GameStatus) => status.scriptWritten,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, { scriptDeployedCount: status.scriptDeployedCount + 1 }),
  stepCount: (status: GameStatus) => status.scriptDeployedCount
};

const kubernetesResearched: PlayEventProperties = {
  additionalValidation: (status: GameStatus) => !status.kubernetesResearched,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, { kubernetesResearched: true }),
  stepCount: () => 0
};

const kubernetesDeploy: PlayEventProperties = {
  additionalValidation: (status: GameStatus) => status.kubernetesResearched,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, {
      kubernetesDeployCount: status.kubernetesDeployCount + 1
    }),
  stepCount: (status: GameStatus) => status.kubernetesDeployCount
};

const ccgCreated: PlayEventProperties = {
  additionalValidation: (status: GameStatus) => !status.ccgCreated,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, {
      ccgCreated: true
    }),
  stepCount: _ => 0
};

const ccgDeploy: PlayEventProperties = {
  additionalValidation: (status: GameStatus) => status.ccgCreated,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, { ccgDeployCount: status.ccgDeployCount + 1 }),
  stepCount: (status: GameStatus) => status.ccgDeployCount
};

const drinkCoffee: PlayEventProperties = {
  additionalValidation: _ => true,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, {
      playerStatus: playerStatusWith(status.playerStatus, { energized: true })
    }),
  stepCount: _ => 0
};

const deEnergize: PlayEventProperties = {
  additionalValidation: _ => true,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, {
      playerStatus: playerStatusWith(status.playerStatus, { energized: false })
    }),
  stepCount: _ => 0
};

const watchTv: PlayEventProperties = {
  additionalValidation: _ => true,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, {
      playerStatus: playerStatusWith(status.playerStatus, { entertained: true })
    }),
  stepCount: _ => 0
};

const unentertain: PlayEventProperties = {
  additionalValidation: _ => false,
  additionalStatusUpdates: (status: GameStatus) =>
    statusWith(status, {
      playerStatus: playerStatusWith(status.playerStatus, {
        entertained: false
      })
    }),
  stepCount: _ => 0
};

const propertiesByType: Map<PlayEventType, PlayEventProperties> = new Map([
  [PlayEventType.Tick, tick],
  [PlayEventType.CookieClicked, cookieClicked],
  [PlayEventType.ScriptWritten, scriptWritten],
  [PlayEventType.ScriptDeployed, scriptDeployed],
  [PlayEventType.KubernetesResearched, kubernetesResearched],
  [PlayEventType.KubernetesDeploy, kubernetesDeploy],
  [PlayEventType.CcgCreated, ccgCreated],
  [PlayEventType.CcgDeploy, ccgDeploy],
  [PlayEventType.DrinkCoffee, drinkCoffee],
  [PlayEventType.DeEnergize, deEnergize],
  [PlayEventType.WatchTv, watchTv],
  [PlayEventType.Unentertained, unentertain]
]);

export const getPropertiesByType = (e: PlayEventType): PlayEventProperties => {
  const properties = propertiesByType.get(e);
  if (properties === undefined) {
    throw new Error('No properties defined for ' + e.name);
  }
  return properties;
};
