import React from 'react';
import Players from './Players';
import Board from './Board';
import ActionPanel from './ActionPanel';
import './Game.scss';
import EncounterModal from './EncounterModal';

const rows = 10;
const columns = 10;
const money = 20;
const thieves = 4;

const encounterMap = {
  thief: {
    message: `You have been robbed!`,
    action: (player) => player.money = 0,
  },
  money: {
    message: `You found 500 money!`,
    action: (player) => player.money += 500, 
  },
  treasure: {
    message: 'You found the treasure!',
    action: (player) => player.treasure = true,
  }
};

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {board: this.constructBoard(), activePlayer: 0, tilesToMove: []};
    this.move = this.move.bind(this);
  }  

  componentDidMount() {
    this.setState({tilesToMove: this.moveableTiles(this.props.players[this.state.activePlayer], this.state.board)});
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

  changeTurn(board) {
    let activePlayer = this.state.activePlayer + 1;
    if (activePlayer + 1 > this.props.players.length) {
      activePlayer = 0;
    }
    const player = this.props.players[activePlayer];
    const tilesToMove = this.moveableTiles(player, board);
    this.setState({activePlayer, board, tilesToMove});
  }

  moveableTiles(activePlayer, board) {    
    const slot = board.find((slot) => slot.obj && slot.obj.name === activePlayer.name);
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

  move(tileId) {
    const board = this.state.board;
    const to = board.find((tile) => tile.id === tileId);
    const activePlayer = this.props.players[this.state.activePlayer];
    const from = board.find((slot) => slot.obj && slot.obj.name === activePlayer.name);
    from.type = 'tile';
    from.obj = null;
    const originalType = to.type;
    to.obj = activePlayer;
    to.type = 'player';
    if (encounterMap[originalType]) {
      const encounter = encounterMap[originalType];
      encounter.action(activePlayer);
      encounter.continue = () => {        
        this.setState({encounter: null});
        this.changeTurn(board)
      };
      this.setState({encounter});
    } else {
      this.changeTurn(board);
    }
  }

  render() {
    let encounter = '';
    if (this.state.encounter) {
      encounter = <EncounterModal encounter={this.state.encounter} />
    }
    return (
      <section>
        <div className="game">
          <div className="info-area">
            <span>Game started</span>
            <Players players={this.props.players} active={this.state.activePlayer} />
          </div>
          <div className="board-area">
            <Board board={this.state.board} tilesToMove={this.state.tilesToMove} onMove={this.move}/>
          </div>
          <div className="action-area">
            <ActionPanel/>
          </div>
        </div>
        {encounter}
      </section>
    )
  }
}

export default Game;