import React from 'react';
import Players from './Players';
import Board from './Board';

const rows = 10;
const columns = 10;
const money = 20;
const thieves = 4;

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {board: this.constructBoard(), activePlayer: 0, tilesToMove: []};
  }  

  componentDidMount() {
    this.setState({tilesToMove: this.moveableTiles()});
  }

  isEmpty(board, location) {
    return board[location].type === 'tile';
  }

  findFreePlace(board, locationFn) {
    while (true) {
      const x = locationFn();
      if (this.isEmpty(board, x)) {
        return x;
      }
    }
  }

  constructBoard() {
    const players = this.props.players;
    const board = [];
    for (let y = 0; y < rows; y++) {      
      for (let x = 0; x < columns; x++) {
        board.push({type: 'tile', paths: [], id: board.length + 1});
      }
    }
    players.forEach((player) => {
      const x = this.findFreePlace(board, () => Math.floor(Math.random() * columns));
      board[x].type = 'player';
      board[x].obj = player;
    });
    for (let i = 0; i < thieves; i++) {
      const x = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
      board[x].type = 'thief';
    }
    for (let i = 0; i < money; i++) {
      const x = this.findFreePlace(board, () => Math.max(10, Math.floor(Math.random() * columns * rows)));
      board[x].type = 'money';
    }
    const x = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
    board[x].type = 'treasure';
    board.forEach((tile, index) => {
      const paths = [];
      if (index > 0 && board[index -1].paths.includes('east')) {
        paths.push('west');
      }
      if (index > columns && board[index - 10].paths.includes('south')) {
        paths.push('north');
      }
      if (index < ((columns * rows) - columns) && Math.random() > 0.3) {
        paths.push('south');
      }
      if (!Number.isInteger((index + 1) / columns) && Math.random() > 0.3) {
        paths.push('east');
      }
      tile.paths = paths;
    });
    return board;
  }

  changeTurn() {
    this.setState({activePlayer: this.state.activePlayer + 1});
    if (this.state.activePlayer + 1 > this.props.players.length) {
      this.setState({activePlayer: 0});
    }
    this.setState({tilesToMove: this.moveableTiles()});
  }

  moveableTiles() {
    const activePlayer = this.props.players[this.state.activePlayer];
    const slot = this.state.board.find((slot) => slot.obj && slot.obj.name === activePlayer.name);
    return slot.paths.map(path => {
      switch(path) {
        case 'north':
          return slot.id - columns;
        case 'east':
          return slot.id + 1;
        case 'south':
          return slot.id + columns;
        case 'west':
          return slot.id - 1;
        default: 
          return null;
      }
    });
  }

  render() {    
    return (
      <section>
        <div className="info">
          <span>Game started</span>
          <Players players={this.props.players} active={this.state.activePlayer} />
        </div>
        <Board board={this.state.board} tilesToMove={this.state.tilesToMove}/>
      </section>
    )
  }
}

export default Game;