import React from 'react';
import { getGameStatus } from '../model/game-status';
import PlayGameDisplay from './PlayGameDisplay';
import { PlayEvent } from '../model/play-event';
import Axios from 'axios';
import { BASE_URL, IS_DEV } from '../constants';
import { GameActionBatch } from '../model/game-action-batch';
import { getGameParameters, GameParameters } from '../model/game-parameters';
import { combineLatest } from 'rxjs';
import { StatusAccumulator } from '../model/status-accumulator';

interface PlayGameProps {
  match: {
    params: {
      id: string;
    };
  };
}

interface PlayGameState {
  status?: StatusAccumulator;
  parameters?: GameParameters;
  errorStatus?: string;
}

export default class PlayGame extends React.Component<
  PlayGameProps,
  PlayGameState,
  {}
> {
  private pendingEvents: Array<PlayEvent>;

  constructor(props: PlayGameProps) {
    super(props);
    this.state = {};

    combineLatest(
      getGameStatus(props.match.params.id),
      getGameParameters()
    ).subscribe({
      next: ([status, parameters]) => {
        this.setState({
          status: new StatusAccumulator(status, parameters),
          parameters
        });
      },
      error: err => {
        const errorStatus = err.toString();
        this.setState({ errorStatus });
      }
    });

    this.pendingEvents = [];
  }

  isLoading(): boolean {
    return (
      !this.state.errorStatus && !this.state.status && !this.state.parameters
    );
  }

  isLoadingError(): boolean {
    return !!this.state.errorStatus && !this.state.status;
  }

  isLoadedError(): boolean {
    return !!this.state.errorStatus && !!this.state.status;
  }

  onEvent(e: PlayEvent): void {
    if (this.state.status && this.state.parameters) {
      this.state.status.adjustStatusFromEvent(e);
      this.pendingEvents.push(e);
      if (this.pendingEvents.length >= this.state.parameters.batchSize) {
        this.dispatchPendingEvents();
      }
    }
  }

  dispatchPendingEvents(): void {
    if (this.state.status) {
      const currentStatus = this.state.status.currentStatus;
      const actions: GameActionBatch = {
        id: currentStatus.id,
        actions: this.pendingEvents.map(event => ({ type: event.type.name })),
        score: currentStatus.score,
        scoreRate: currentStatus.scoreRate
      };
      if (IS_DEV) {
        console.log('Dispatching batch', actions);
      }
      Axios.post<{ valid: boolean }>(BASE_URL + 'game/act', actions)
        .then(result => {
          if (!result.data.valid) {
            this.setState({
              errorStatus: `Invalid actions received, you're either cheating 
              or don't have a good internet connection. Please refresh and try again :)`
            });
          }
        })
        .catch(err => this.setState({ errorStatus: err.toString() }));
      this.pendingEvents = [];
    }
  }

  render(): React.ReactElement {
    return (
      <div>
        {this.isLoadingError() ? (
          <p>Failed to load - {this.state.errorStatus}</p>
        ) : this.isLoadedError() ? (
          <p>Something went wrong while playing - {this.state.errorStatus}</p>
        ) : this.isLoading() ? (
          <p>Loading game {this.props.match.params.id}</p>
        ) : (
          <PlayGameDisplay
            status$={this.state.status!.status$}
            gameParameters={this.state.parameters!}
            onEventDispatched={e => this.onEvent(e)}
          ></PlayGameDisplay>
        )}
      </div>
    );
  }
}
