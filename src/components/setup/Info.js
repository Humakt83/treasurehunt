import React from 'react';
import './Info.scss';

export default class Setup extends React.Component {

  render() {
    return (
      <div className="info-container">
        <p className="info-main">
          Welcome to the <span className="name">Treasure Hunt</span> - a turnbased board game.<br/>
          Find 💎 and bring it to your starting location to win the game.<br/>
          Use 🎲 or press r to throw a dice and move to highlighted location.<br/>
          Buy 🛶 (300 €) or 🚁 (1000 €) trip to move 1 or 3 tiles directly to north, south, west or east.<br/>
          Use 🔨 to skip the turn and earn 100 €. <br/>
          Buy 📜 for 1000 € to steal 💎 from another player. You can only have one of these at a time and you must move to the location where the player with 💎 is. <br/>
          Enter locations with ❓ to find something interesting.
        </p>        
      </div>
    );
  }
}
