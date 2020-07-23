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
    this.skip = this.skip.bind(this);
    this.roll = this.roll.bind(this);
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
    this.setState({activePlayer, board, tilesToMove: [], actionsDisabled: false});
  }

  moveableTiles(activePlayer, board, rollAmount, slotPassed = null, fromDirection = null) {
    const slot = slotPassed ? board[slotPassed - 1] : board.find((slot) => slot.obj && slot.obj.name === activePlayer.name);
    const tiles = slot.paths
      .filter((path) => !fromDirection 
        || (fromDirection === 'north' && path !== 'south')
        || (fromDirection === 'south' && path !== 'north')
        || (fromDirection === 'west' && path !== 'east')
        || (fromDirection === 'east' && path !== 'west'))
      .map(path => {
      switch(path) {
        case 'north':
          if (rollAmount > 1) {
            return this.moveableTiles(activePlayer, board, rollAmount - 1, slot.id - columns, 'north')
          }
          return [slot.id - columns];
        case 'east':
          if (rollAmount > 1) {
            return this.moveableTiles(activePlayer, board, rollAmount - 1, slot.id + 1, 'east')
          }
          return [slot.id + 1];
        case 'south':
          if (rollAmount > 1) {
            return this.moveableTiles(activePlayer, board, rollAmount - 1, slot.id + columns, 'south')
          }
          return [slot.id + columns];
        case 'west':
          if (rollAmount > 1) {
            return this.moveableTiles(activePlayer, board, rollAmount - 1, slot.id - 1, 'west')
          }
          return [slot.id - 1];
        default: 
          return [];
      }
    }).reduce((previous, current) => previous.concat(current), []);
    const uniqueTiles = new Set(tiles);
    return [...uniqueTiles];
  }

  move(event, tileId) {
    event.preventDefault();    
    event.stopPropagation();    
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

  roll() {
    const rollAmount = 1 + Math.floor(Math.random() * 3);
    const tilesToMove = this.moveableTiles(this.props.players[this.state.activePlayer], this.state.board, rollAmount);
    if (tilesToMove.length > 1) {
      this.setState({actionsDisabled: true, rolled: rollAmount, tilesToMove});
    } else {
      this.setState({rolled: rollAmount});
      this.changeTurn(this.state.board);
    }
  }

  skip() {
    this.props.players[this.state.activePlayer].money += 100;
    this.changeTurn(this.state.board);
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
            <Players players={this.props.players} active={this.state.activePlayer} />
          </div>
          <div className="board-area">
            <Board board={this.state.board} tilesToMove={this.state.tilesToMove} onMove={this.move}/>
          </div>
          <div className="action-area">
            <ActionPanel disabled={this.state.actionsDisabled} actions={{skip: this.skip, roll: this.roll}}/>
          </div>
        </div>
        {encounter}
      </section>
    )
  }
}

export default Game;