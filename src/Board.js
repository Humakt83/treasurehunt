import React from 'react';
import './Board.scss';

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
    const moveableTiles = this.props.tilesToMove;
    const table = [];
    board.forEach((slot, index) => {
      let slotType = emojiMap[slot.type];
      if (slot.type === 'player') {
        const className =  'player player--' + slot.obj.color;
        slotType = <span className={className} aria-label={slot.type} role="img">{slotType}</span>;
      }
      const tileClassName = moveableTiles.includes(slot.id) ? 'tile tile--movable' : 'tile';
      table.push(
        <div className={tileClassName} key={index}>
          {slot.paths.map((path) => {
            const key = index + '-' + path;
            return <div key={key} className={'path ' + path}></div>;
          })}
          {slotType}
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
