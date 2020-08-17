import React from 'react';
import Players from './Players';
import Board from './Board';
import ActionPanel from './ActionPanel';
import './Game.scss';
import EncounterModal from './EncounterModal';
import GameOverCurtain from './GameOverCurtain';

const rows = 10;
const columns = 10;
const money = 20;
const thieves = 4;

const encounterMap = {
  thief: {
    emoji: '🤠',
    message: `You have been robbed!`,
    action: (player) => player.money = 0,
  },
  money: {
    emoji: '💰',
    message: `You found a jewel worth 500 €!`,
    action: (player) => player.money += 500, 
  },
  treasure: {
    emoji: '💎',
    message: 'You found the treasure!',
    action: (player) => player.treasure = true,
  },
  home: {
    hasAnyEffect: (player, home) => player.treasure && home.owner === player,
    message: 'You have reached home with the treasure, you are victorious!',
    action: (player) => player.winner = true,
  }
};

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {board: this.constructBoard(), activePlayer: 0, tilesToMove: []};
    this.move = this.move.bind(this);
    this.skip = this.skip.bind(this);
    this.roll = this.roll.bind(this);
    this.helicopter = this.helicopter.bind(this);
    this.ship = this.ship.bind(this);
  }  

  isEmpty(board, location) {
    return board[location].objs.length <= 0;
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
        board.push({objs: [], paths: [], id: board.length + 1});
      }
    }
    players.forEach((player) => {
      const x = this.findFreePlace(board, () => Math.floor(Math.random() * columns));
      board[x].objs.push({type: 'home', obj: player.home});
      board[x].objs.push({type: 'player', obj: player});
    });
    for (let i = 0; i < thieves; i++) {
      const x = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
      board[x].objs.push({type: 'thief'});
    }
    for (let i = 0; i < money; i++) {
      const x = this.findFreePlace(board, () => Math.max(10, Math.floor(Math.random() * columns * rows)));
      board[x].objs.push({type: 'money'});
    }
    const x = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
    board[x].objs.push({type: 'treasure'});
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
    if (this.props.players[this.state.activePlayer].winner) {
      this.setState({gameOver: true});
      return;
    }
    let activePlayer = this.state.activePlayer + 1;
    if (activePlayer + 1 > this.props.players.length) {
      activePlayer = 0;
    }
    this.setState({activePlayer, board, tilesToMove: [], actionsDisabled: false});
  }

  findPlayerSlot(player) {
    const board = this.state.board;
    return board.find((slot) => slot.objs && slot.objs.find(obj => obj.obj && obj.obj.name === player.name));
  }

  moveableTiles(activePlayer, board, rollAmount, slotPassed = null, fromDirection = null) {
    const slot = slotPassed ? board[slotPassed - 1] : this.findPlayerSlot(activePlayer);
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
    const from = this.findPlayerSlot(activePlayer);
    from.objs = from.objs.filter(obj => !obj.obj || obj.obj.name !== activePlayer.name);
    const encounterables = to.objs.filter((obj) => encounterMap[obj.type] && (!encounterMap[obj.type].hasAnyEffect || encounterMap[obj.type].hasAnyEffect(activePlayer, obj.obj)));
    to.objs.push({type: 'player', obj: activePlayer});
    to.objs = to.objs.filter((obj) => obj.type === 'player' || (obj.obj && obj.obj.permanent));
    encounterables.forEach((obj) => {
      if (encounterMap[obj.type]) {
        const encounter = encounterMap[obj.type];
        encounter.action(activePlayer);
        encounter.continue = () => {        
          this.setState({encounter: null});
          this.changeTurn(board)
        };
        this.setState({encounter});
      }
    });
    if (encounterables.length <= 0) {
      this.changeTurn(board);
    }
  }

  roll() {
    const rollAmount = 1 + Math.floor(Math.random() * 3);
    const tilesToMove = this.moveableTiles(this.props.players[this.state.activePlayer], this.state.board, rollAmount);
    const oddOrEven = this.state.rollToggle ? false : true;
    if (tilesToMove.length > 0) {
      this.setState({actionsDisabled: true, rolled: rollAmount, tilesToMove, rollToggle: oddOrEven});
    } else {
      this.setState({rolled: rollAmount, rollToggle: oddOrEven});
      this.changeTurn(this.state.board);
    }
  }

  movableTilesToAnyDirection(player, travelAmount) {
    const from = this.findPlayerSlot(player);
    const tiles = new Set();
    const secondStartDigit = from.id < 10 ? from.id : Number.parseInt(('' + from.id)[1]);
    for (let i = 1; i <= travelAmount; i++) {  
      if (from.id % columns !== 0 && secondStartDigit + i < (columns + 1)) {
        tiles.add(from.id + i);
      }
      if (from.id % columns === 0 || secondStartDigit - i > 0) {
        tiles.add(from.id - i);
      }
      tiles.add(from.id + (columns * i));
      tiles.add(from.id - (columns * i));
    }
    const legalTiles = [...tiles].filter((tile) => tile > 0 && tile <= rows * columns);
    this.setState({tilesToMove: legalTiles, actionsDisabled: true});
  }

  helicopter() {
    const player = this.props.players[this.state.activePlayer];
    player.money -= 1000;
    this.movableTilesToAnyDirection(player, 3);
  }

  ship() {
    const player = this.props.players[this.state.activePlayer];
    player.money -= 300;
    this.movableTilesToAnyDirection(player, 1);
  }

  skip() {
    this.props.players[this.state.activePlayer].money += 100;
    this.changeTurn(this.state.board);
  }

  render() {
    let encounter = '';
    if (this.state.encounter) {
      encounter = <EncounterModal encounter={this.state.encounter} />;
    }
    let gameOver = ''
    if (this.state.gameOver) {
      gameOver = <GameOverCurtain players={this.props.players}/>;
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
            <ActionPanel disabled={this.state.actionsDisabled} money={this.props.players[this.state.activePlayer].money}
              actions={{skip: this.skip, roll: this.roll, helicopter: this.helicopter, ship: this.ship}}
              roll={this.state.rolled} rollToggle={this.state.rollToggle}/>
          </div>
        </div>
        {gameOver}
        {encounter}
      </section>
    )
  }
}

export default Game;