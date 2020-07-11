import React from 'react';

export default class Players extends React.Component {
  render() {
    const players = this.props.players.map((player, index) => <div className="player" key={index}><span>{player}</span></div>)
    return (
      <div className="players">
        {players}
      </div>
    )
  }
}