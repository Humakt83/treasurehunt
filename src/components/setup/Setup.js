import React from 'react';
import Game from '../game/Game';
import './Setup.scss';
import {createPlayer} from '../../objects/Player';
import Info from './Info';

const maximumPlayers = 8;
let socket;

export default class Setup extends React.Component {
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
    if (window.location.href.indexOf('gameId=') >= 0) {
      const mePlayer = window.location.href.split('player=')[1];
      this.createAndOpenSocket();
      this.setState({mePlayer});
    } else {
      this.addPlayer();
      this.addPlayer();
    }
  }

  createAndOpenSocket() {
    let uri = "ws://" + window.location.host + window.location.pathname;
    uri = uri.substring(0, uri.lastIndexOf('/'));
    socket = new WebSocket(uri);

    socket.onerror = (error) => {
      console.log(`error ${error}`);
    };
    
    socket.onopen = (event) => {
      console.log(`opened, Connected to ${event.currentTarget.url}`);
    };
    
    socket.onmessage = function(event) {
      console.log(`received <<<  ${event.data}`);
      switch (event.data.type) {
        case 'PLAYERS': {
          let players = event.data.content.map((name, index) => createPlayer(name, index));
          this.setState({players, gameStarted: true});
          break;
        }
        case 'GAMEDATA': {
          this.setState({gameData: event.data.content});
          break;
        }
        default: 
          break;
      }
    };
    
    socket.onclose = function(event) {
        console.log(`closed, Disconnected: ${event.code} ${event.reason}`);
        socket = null;
    };
  }

  send = (data) => {
    socket.send(JSON.stringify(data));
  }

  addPlayer() {
    const players = this.state.players;
    players.push(createPlayer(`Player ${players.length + 1}`, players.length));
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
      return <Game players={this.state.players} useSocket={socket !== undefined} send={this.send} mePlayer={this.state.mePlayer} gameData={this.state.gameData}/>
    }
    if (this.state.mePlayer) {
      return <span>Waiting...</span>;
    }
    let playerNames = this.state.players.map((item, index) => <input key={index} value={item.name} onChange={(value) => this.changeName(value, index)}></input>);    
    return (

      <div className="setup">
        <header className="setup-header">
          <span role="img" className="setup-logo-money" aria-label="money">💶</span>
          <span role="img" className="setup-logo-money" aria-label="money">💰</span>
          <span role="img" className="setup-logo" aria-label="treasure">💎</span>
          <span role="img" className="setup-logo-money" aria-label="money">💰</span>
          <span role="img" className="setup-logo-money" aria-label="money">💶</span>
        </header>
        <div>
          <button onClick={this.addPlayer} disabled={this.state.players.length >= maximumPlayers}>Add player</button>
          <button onClick={this.startGame} disabled={this.isInvalidToStart()}>Start game</button>
          {playerNames}
        </div>
        <Info />
      </div>
    );
  }
}
