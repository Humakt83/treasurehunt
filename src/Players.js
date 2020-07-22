import React from 'react';
import './Players.scss';

export default class Players extends React.Component {
  render() {
    const activePlayer = this.props.active;
    const players = this.props.players.map((player, index) => {
      const active = activePlayer === index ? ' player--active': '';
      const className = 'player player--' + player.color + active;
      return <div className={className} key={index}>
        <span>{player.name}</span>
      </div>
    });
    
    return (
      <div className="players">
        {players}
      </div>
    )
  }
}