import React from 'react';
import Players from './Players';
import Board from './Board';

class Game extends React.Component {
  render() {
    return (
      <section>
        <div className="info">
          <span>Game started</span>
          <Players players={this.props.players} />
        </div>
        <Board players={this.props.players}/>
      </section>
    )
  }
}

export default Game;