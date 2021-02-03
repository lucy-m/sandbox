import { Time } from '../converters/model';
import React, { ChangeEvent } from 'react';
import irving from '../Assets/Irving.png';
import adriana from '../Assets/Adriana.png';
import './NewGame.scss';
import { GameInitialConfig } from '../model/game-initial-config';

const characters: { name: string; path: string }[] = [
  {
    name: 'Irving',
    path: irving
  },
  {
    name: 'Adriana',
    path: adriana
  }
];

interface NewGameProps {
  onGameStarted: (config: GameInitialConfig) => void;
  onLeaderboard: () => void;
}

interface NewGameState {
  time: Time;
  playerName: string;
  selectedCharacter: string;
}

export default class NewGame extends React.Component<
  NewGameProps,
  NewGameState,
  {}
> {
  constructor(props: NewGameProps) {
    super(props);

    this.state = {
      time: { time: 0 },
      playerName: '',
      selectedCharacter: ''
    };
  }

  handleInputChange(changeEvent: ChangeEvent<HTMLInputElement>): void {
    const playerName = changeEvent.target.value.trim().slice(0, 30);
    this.setState({
      playerName
    });
  }

  handleOptionChange(changeEvent: ChangeEvent<HTMLInputElement>): void {
    const selectedCharacter = changeEvent.target.value;
    this.setState({
      selectedCharacter
    });
  }

  canStartGame(): boolean {
    return (
      !!this.state.playerName &&
      this.state.playerName.trim() !== '' &&
      !!this.state.selectedCharacter &&
      characters.findIndex(
        char => char.name === this.state.selectedCharacter
      ) >= 0
    );
  }

  startGame(): void {
    this.props.onGameStarted({
      playerName: this.state.playerName,
      selectedCharacter: this.state.selectedCharacter
    });
  }

  render(): React.ReactElement {
    return (
      <div className="stack wrapper">
        <h1>Welcome to TPW Simulator 2020</h1>
        <p>
          The year is 2020, you have recently joined TPW as an intern, and you
          have decided your intern project will be to get the highest ever score
          on Cookie Clicker. The way you will do this is to use all of your best
          developer skills to build the most sophisticated Cookie Clicker
          Playing Platform.
        </p>
        <button onClick={() => this.props.onLeaderboard()}>
          View the leaderboard!
        </button>
        <div className="question">
          <label>What is your name?</label>
          <input onChange={e => this.handleInputChange(e)}></input>
        </div>
        <div className="question">
          <label>With whom do you identify the most?</label>
          <div className="characters">
            {characters.map(char => (
              <div key={char.name}>
                <label>
                  <input
                    type="radio"
                    name="character"
                    value={char.name}
                    onChange={e => this.handleOptionChange(e)}
                  />
                  {char.name}
                </label>
                <img
                  src={char.path}
                  alt={char.name}
                  className="character-image"
                ></img>
              </div>
            ))}
          </div>
        </div>
        <button
          className="play-button"
          disabled={!this.canStartGame()}
          onClick={() => this.startGame()}
        >
          Play!
        </button>
        <p>Excitedly hacked together by Lucy Mair</p>
      </div>
    );
  }
}
