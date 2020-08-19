import React from 'react';
import './GameOverCurtain.scss';

export default class GameOverCurtain extends React.Component {

  toMain() {
    window.location.reload();
  }

  render() {
    const winner = this.props.players.find((player) => player.winner);
    const messageWinner = `💎 Winner is ${winner.name}! 💎`;
    const listedPlayers = this.props.players.sort((a, b) => {
      if (a.winner) {
        return -1;
      }
      if (b.winner) {
        return 1;
      }
      return a.money >= b.money ? -1 : 1;
    }).map((player) => <li>{player.name} {player.money} €</li>);
    return (
      <section>
        <div className="curtain">
          <div className="finish-modal">
            <p>{messageWinner}</p>
            <ol>
              {listedPlayers}
            </ol>
            <button className="confirmButton" onClick={this.toMain}>OK</button>
          </div>
        </div>
      </section>
    )
  }
};
