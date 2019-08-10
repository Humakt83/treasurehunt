import React from 'react';
import Game from './Game';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: ['Player 1', 'Player 2']};
    this.startGame = this.startGame.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.changeName = this.changeName.bind(this);
  }

  startGame() {
    this.setState({players: this.state.players, gameStarted: true});
  }

  addPlayer() {
    const players = this.state.players;
    players.push('');
    this.setState({players});
  }

  changeName(event, index) {
    const players = this.state.players;    
    players[index] = event.target.value;
    this.setState({players});
  }

  render() {
    if (this.state.gameStarted) {
      return <Game players={this.state.players}/>
    }
    let playerNames = this.state.players.map((item, index) => <input key={index} value={item} onChange={(value) => this.changeName(value, index)}></input>);    
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
          <button onClick={this.addPlayer}>Add player</button>
          <button onClick={this.startGame} disabled={this.state.players.length <2}>Start game</button>
          {playerNames}
        </div>
      </div>
    );
  }
}

export default App;
