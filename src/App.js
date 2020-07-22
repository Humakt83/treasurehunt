import React from 'react';
import Game from './Game';
import './App.scss';

const maximumPlayers = 8;
const playerColors = ['blue', 'red', 'yellow', 'white', 'black', 'tan', 'cyan', 'lightgray']

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: []};
    this.startGame = this.startGame.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.changeName = this.changeName.bind(this);
  }

  startGame() {
    this.setState({players: this.state.players, gameStarted: true});
  }

  componentDidMount() {
    this.addPlayer();
    this.addPlayer();
  }

  addPlayer() {
    const players = this.state.players;
    players.push({name: `Player ${players.length + 1}`, money: 1000, color: playerColors[players.length]});
    this.setState({players});
  }

  changeName(event, index) {
    const players = this.state.players;    
    players[index].name = event.target.value;
    this.setState({players});
  }

  isInvalidToStart() {
    const players = this.state.players;
    return players.length < 2 || players.some(((player) => player.name.trim().length === 0));
  }

  render() {
    if (this.state.gameStarted) {
      return <Game players={this.state.players}/>
    }
    let playerNames = this.state.players.map((item, index) => <input key={index} value={item.name} onChange={(value) => this.changeName(value, index)}></input>);    
    return (

      <div className="App">
        <header className="App-header">
          <span role="img" className="App-logo-money" aria-label="money">💶</span>
          <span role="img" className="App-logo-money" aria-label="money">💰</span>
          <span role="img" className="App-logo" aria-label="treasure">💎</span>
          <span role="img" className="App-logo-money" aria-label="money">💰</span>
          <span role="img" className="App-logo-money" aria-label="money">💶</span>
        </header>
        <div>
          <button onClick={this.addPlayer} disabled={this.state.players.length >= maximumPlayers}>Add player</button>
          <button onClick={this.startGame} disabled={this.isInvalidToStart()}>Start game</button>
          {playerNames}
        </div>
      </div>
    );
  }
}

export default App;
