import React from 'react';

export default class Players extends React.Component {
  render() {
    const players = this.props.players.map((player, index) => <li key={index}>{player}</li>)
    return (
      <ul>
        {players}
      </ul>
    )
  }
}