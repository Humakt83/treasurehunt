import React from 'react';

const rows = 10;
const columns = 10;
const money = 20;
const thieves = 4;
const emojiMap = {
  'player': '😀',
  'thief': '🤠',
  'money': '💰',
  'treasure': '💎',
  'tile': '🟩'
};

export default class Board extends React.Component {

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

  constructMap() {
    const players = this.props.players;
    const board = [];
    for (let y = 0; y < rows; y++) {      
      for (let x = 0; x < columns; x++) {
        board.push({type: 'tile'});
      }
    }
    players.forEach((player) => {
      const x = this.findFreePlace(board, () => Math.floor(Math.random() * columns));
      board[x] = {type: 'player', obj: player};
    });
    for (let i = 0; i < thieves; i++) {
      const x = this.findFreePlace(board, () => Math.max(20, Math.floor(Math.random() * columns * rows)));
      board[x] = {type: 'thief'};
    }
    for (let i = 0; i < money; i++) {
      const x = this.findFreePlace(board, () => Math.max(10, Math.floor(Math.random() * columns * rows)));
      board[x] = {type: 'money'};
    }
    const x = this.findFreePlace(board, () => Math.max(30, Math.floor(Math.random() * columns * rows)));
    board[x] = {type: 'treasure'};
    const table = [];
    board.forEach((slot, index) => {
      table.push(<div className="tile" key={index}>{emojiMap[slot.type]}</div>);
    });
    return table;
  }

  render() {
    return (
      <section>
        <div className="level">
          {this.constructMap()}
        </div>
      </section>
    )
  }
};
