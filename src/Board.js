import React from 'react';
import './Board.css';

const emojiMap = {
  'player': '😀',
  'thief': '🤠',
  'money': '💰',
  'treasure': '💎',
  'tile': '🟩'
};

export default class Board extends React.Component {

  constructMap() {
    const board = this.props.board;
    const table = [];
    board.forEach((slot, index) => {
      table.push(
        <div className='tile' key={index}>
          {slot.paths.map((path) => <div className={'path ' + path}></div>)}
          {emojiMap[slot.type]}
        </div>);
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
