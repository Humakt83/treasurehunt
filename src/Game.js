import React from 'react';
import Players from './Players';
import Board from './Board';

const rows = 10;
const columns = 10;
const money = 20;
const thieves = 4;

class Game extends React.Component {

  board = [];
  activePlayer = 0;

  constructor(props) {
    super(props);
    this.board = this.constructBoard();
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
        board.push({type: 'tile', paths: ['north', 'west', 'east', 'south']});
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

  render() {    
    return (
      <section>
        <div className="info">
          <span>Game started</span>
          <Players players={this.props.players} active={this.activePlayer} />
        </div>
        <Board board={this.board}/>
      </section>
    )
  }
}

export default Game;