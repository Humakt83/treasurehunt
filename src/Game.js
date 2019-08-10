import React from 'react';
import Players from './Players';

class Game extends React.Component {
  render() {
    return (
      <section>
        <span>Game started</span>
        <Players players={this.props.players} />
      </section>
    )
  }
}

export default Game;