import React from 'react';
import Players from './Players';
import Board from './Board';

class Game extends React.Component {
  render() {
    return (
      <section>
        <span>Game started</span>
        <Players players={this.props.players} />
        <Board />
      </section>
    )
  }
}

export default Game;