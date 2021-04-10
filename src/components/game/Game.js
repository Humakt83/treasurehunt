import React from 'react';
import Players from './Players';
import Board from './Board';
import ActionPanel from './ActionPanel';
import './Game.scss';
import EncounterModal from '../modals/EncounterModal';
import GameOverCurtain from '../modals/GameOverCurtain';

const rows = 10;
const columns = 10;
const money = 25;
const thieves = 5;
const fruits = 5;
const trees = 15;

const encounterMap = {
  thief: () => {
    return {
      emoji: '🤠',
      message: `You have been robbed!`,
      action: (player) => player.money = 0,
    };
  },
  money: () => {
    const amount = Math.ceil(Math.random() * 10) * 100;
    return {
      emoji: '💰',
      message: `You found a jewel worth ${amount}€!`,
      action: (player) => player.money += amount, 
    };
  },
  treasure: () => {
    return {
      emoji: '💎',
      message: 'You found the treasure!',
      action: (player) => player.treasure = true,
    }    
  },
  fruit: () => {
    return {
      emoji: '🍍',
      message: 'You found a refreshing fruit and can move again!',
      action: (player, game) => {
        const previousPlayer = player.id === 0 ? game.props.players.length -1 : player.id -1;
        game.setState({activePlayer: previousPlayer});
      }
    };
  },
  home: () => {
    return {
      hasAnyEffect: (player, home) => player.treasure && home.owner === player,
      message: 'You have reached home with the treasure, you are victorious!',
      action: (player) => player.winner = true,
    };
  },
  player: () => {
    return {
      hasAnyEffect: (player, anotherPlayer) => {
        return player.fakeDocuments && anotherPlayer.treasure;
      },
      emoji: '📜',
      message: 'You use fake documents to claim that treasure is yours by right',
      action: (player, game) => {
        player.fakeDocuments = false;
        game.props.players.find(player => player.treasure).treasure = false;
        player.treasure = true;
      }
    }
  },
  volcano: () => {
    return {
      emoji: '🌋',
      message: 'You enter an area of a erupting volcano. You must leave here by any means possible.',
      action: (player, game) => {
        const previousPlayer = player.id === 0 ? game.props.players.length -1 : player.id -1;
        player.onVolcano = true;
        game.setState({activePlayer: previousPlayer});
      }
    }
  }
};

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {board: this.constructBoard(props.players), activePlayer: 0, tilesToMove: [], players: props.players};
    this.move = this.move.bind(this);
    this.skip = this.skip.bind(this);
    this.roll = this.roll.bind(this);
    this.helicopter = this.helicopter.bind(this);
    this.ship = this.ship.bind(this);
    this.buyFakeDocuments = this.buyFakeDocuments.bind(this);
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

  componentDidUpdate(prevProps) {
    if (this.props.gameData && (!prevProps.gameData || prevProps.gameData.activePlayer !== this.props.gameData.activePlayer)) {
      const waiting = this.state.players[this.props.activePlayer].name !== this.props.mePlayer;
      this.setState({activePlayer: this.props.activePlayer, board: this.props.board, waiting, players: this.props.players});
    }
  }

  constructBoard(players) {
    const board = [];
    for (let y = 0; y < rows; y++) {      
      for (let x = 0; x < columns; x++) {        
        board.push({objs: [], paths: [], id: board.length + 1});
      }
    }
    for (let i = 0; i < trees; i++) {
      const x = this.findFreePlace(board, () => Math.max(10, Math.floor(Math.random() * columns * rows)));
      const tree = Math.random() > 0.3 ? '🌴': '🌵';
      board[x].objs.push({type: 'tree', obj: {permanent: true, emoji: tree}});
    }
    const volcanoLocation = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
    board[volcanoLocation].objs.push({type: 'volcano', obj: {permanent: true, emoji: '🌋'}});
    players.forEach((player) => {
      const x = this.findFreePlace(board, () => Math.floor(Math.random() * columns));
      board[x].objs.push({type: 'home', obj: player.home});
      board[x].objs.push({type: 'player', obj: player});
    });
    for (let i = 0; i < thieves; i++) {
      const x = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
      board[x].objs.push({type: 'thief'});
    }
    for (let i = 0; i < fruits; i++) {
      const x = this.findFreePlace(board, () => Math.max(10, Math.floor(Math.random() * columns * rows)));
      board[x].objs.push({type: 'fruit'});
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

  changeTurn(board, modificationToTurnOrder = 0) {
    if (this.props.useSocket) {
      this.changeTurnWebsocket(board, modificationToTurnOrder);
    } else {
      this.changeTurnHotseat(board, modificationToTurnOrder);
    }
  }

  changeTurnHotseat(board, modificationToTurnOrder) {
    if (this.state.players[this.state.activePlayer].winner) {
      this.setState({gameOver: true});
      return;
    }
    let activePlayer = this.state.activePlayer + 1 + modificationToTurnOrder;
    if (activePlayer + 1 > this.state.players.length) {
      activePlayer = 0;
    }
    this.setState({activePlayer, board, tilesToMove: [], actionsDisabled: false});
  }

  changeTurnWebsocket(board, modificationToTurnOrder) {
    if (this.state.players[this.state.activePlayer].winner) {
      this.setState({gameOver: true});
      this.state.send(this.state);
      return;
    }
    let activePlayer = this.state.activePlayer + 1 + modificationToTurnOrder;
    if (activePlayer + 1 > this.state.players.length) {
      activePlayer = 0;
    }
    const waiting = this.state.players[activePlayer].name !== this.props.mePlayer;
    this.setState({activePlayer, board, tilesToMove: [], actionsDisabled: false, waiting});
    this.props.send({activePlayer, board});
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
    const activePlayer = this.state.players[this.state.activePlayer];
    activePlayer.onVolcano = false;
    const from = this.findPlayerSlot(activePlayer);
    from.objs = from.objs.filter(obj => !obj.obj || obj.obj.name !== activePlayer.name);
    const encounterables = to.objs.filter((obj) => encounterMap[obj.type] && (!encounterMap[obj.type]().hasAnyEffect || encounterMap[obj.type]().hasAnyEffect(activePlayer, obj.obj)));
    to.objs.push({type: 'player', obj: activePlayer});
    to.objs = to.objs.filter((obj) => obj.type === 'player' || (obj.obj && obj.obj.permanent));
    if (encounterables.length <= 0) {
      this.changeTurn(board);
    } else {
      const encounter = encounterMap[encounterables[0].type]();
      encounter.action(activePlayer, this);
      encounter.continue = () => {
        this.setState({encounter: null});
        this.changeTurn(board)
      };
      this.setState({encounter});
    }
  }

  roll() {
    const rollAmount = 1 + Math.floor(Math.random() * 3);
    const tilesToMove = this.moveableTiles(this.state.players[this.state.activePlayer], this.state.board, rollAmount);
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
    const player = this.state.players[this.state.activePlayer];
    player.money -= 1000;
    this.movableTilesToAnyDirection(player, 3);
  }

  ship() {
    const player = this.state.players[this.state.activePlayer];
    player.money -= 300;
    this.movableTilesToAnyDirection(player, 1);
  }

  skip() {
    this.state.players[this.state.activePlayer].money += 100;
    this.changeTurn(this.state.board);
  }

  buyFakeDocuments() {
    const player = this.state.players[this.state.activePlayer];
    player.money -= 1000;
    player.fakeDocuments = true;
    this.changeTurn(this.state.board);
  }

  render() {
    let encounter = '';
    if (this.state.encounter) {
      encounter = <EncounterModal encounter={this.state.encounter} />;
    }
    let gameOver = ''
    if (this.state.gameOver) {
      gameOver = <GameOverCurtain players={this.state.players}/>;
    }
    let waiting = '';
    if (this.state.waiting) {
      waiting = <div className="waitingCurtain"></div>;
    }
    return (
      <section>
        <div className="game">
          <div className="info-area">
            <Players players={this.state.players} active={this.state.activePlayer} />
          </div>
          <div className="board-area">
            <Board board={this.state.board} tilesToMove={this.state.tilesToMove} onMove={this.move}/>
          </div>
          <div className="action-area">
            <ActionPanel disabled={this.state.actionsDisabled} player={this.state.players[this.state.activePlayer]}
              actions={{skip: this.skip, roll: this.roll, helicopter: this.helicopter, ship: this.ship, buyFakeDocuments: this.buyFakeDocuments}}
              roll={this.state.rolled} rollToggle={this.state.rollToggle}/>
          </div>
        </div>
        {gameOver}
        {encounter}
        {waiting}
      </section>
    )
  }
}

export default Game;