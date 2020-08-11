import React from 'react';
import './Board.scss';

const emojiMap = {
  'player': '😀',
  'thief': '🤠',
  'money': '💰',
  'treasure': '💎'
};

export default class Board extends React.Component {

  constructMap() {
    const board = this.props.board;
    const moveableTiles = this.props.tilesToMove;
    const table = [];
    board.forEach((slot, index) => {      
      const moveable = moveableTiles.includes(slot.id)
      const clickFn = moveable ? this.props.onMove : (event) => event.preventDefault();
      const tileClassName = moveable ? 'tile tile--movable' : 'tile';
      table.push(
        <div className={tileClassName} key={index} onClick={(e) => clickFn(e, slot.id)}>
          {slot.paths.map((path) => {
            const key = index + '-' + path;
            return <div key={key} className={'path ' + path}></div>;
          })}
          {slot.objs.map((obj, index) => {
            const emoji = emojiMap[obj.type]; 
            const key = index + '-' + obj.type;
            if (obj.type === 'player') {
              const className =  'player player--' + obj.obj.color;
              return <span key={key} className={className} aria-label={obj.type} role="img">{emoji}</span>;
            } else {
              return <span key={key}>{emoji}</span>;
            }
          })}
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
