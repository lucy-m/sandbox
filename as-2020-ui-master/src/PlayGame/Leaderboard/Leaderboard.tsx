import React, { Fragment } from 'react';
import { Subscription, interval } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';
import { toObservable } from '../../model/util';
import Axios from 'axios';
import { BASE_URL } from '../../constants';
import './Leaderboard.scss';

interface LeaderboardEntry {
  player: string;
  score: number;
}

interface LeaderboardState {
  leaderboard: Array<LeaderboardEntry>;
}

export class Leaderboard extends React.Component<{}, LeaderboardState, {}> {
  private readonly getLeaderboardSub: Subscription;

  constructor(props: {}) {
    super(props);

    this.state = {
      leaderboard: []
    };

    this.getLeaderboardSub = interval(10000)
      .pipe(
        startWith(0),
        switchMap(_ =>
          toObservable(
            Axios.get<Array<LeaderboardEntry>>(BASE_URL + 'game/leaderboard')
          )
        ),
        map(response => response.data)
      )
      .subscribe({
        next: leaderboard => this.setState({ leaderboard }),
        error: err => console.error(err)
      });
  }

  componentWillUnmount(): void {
    this.getLeaderboardSub.unsubscribe();
  }

  render(): React.ReactElement {
    const leaderboardEntries =
      this.state.leaderboard.length === 0 ? (
        <p>No entries</p>
      ) : (
        <div className="leaderboard-grid">
          {this.state.leaderboard.map((entry, index) => (
            <Fragment key={index}>
              <div className="cell position">{index + 1}</div>
              <div className="cell player">{entry.player}</div>
              <div className="cell score">{entry.score}</div>
            </Fragment>
          ))}
        </div>
      );

    return (
      <div className="wrapper">
        <h1>Leaderboard</h1>

        {leaderboardEntries}
      </div>
    );
  }
}
