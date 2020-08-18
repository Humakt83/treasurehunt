import React from 'react';
import './ActionPanel.scss';
import Dice from './Dice';

export default class ActionPanel extends React.Component {

  render() {
    return (
      <section>
        <div className="action-panel">
          <button disabled={this.props.disabled} onClick={this.props.actions.roll}>
            <span aria-label="roll" role="img">🎲</span>
          </button>
          <button disabled={this.props.disabled || this.props.player.money < 300} onClick={this.props.actions.ship}>
            <span aria-label="ship costs 300" role="img">🛶</span>
          </button>
          <button disabled={this.props.disabled || this.props.player.money < 1000} onClick={this.props.actions.helicopter}>
            <span aria-label="helicopter costs 1000" role="img">🚁</span>
          </button>
          <button onClick={this.props.actions.skip} disabled={this.props.disabled}>
            <span aria-label="work to earn 100 money" role="img">🔨</span>
          </button>
          <button disabled={this.props.disabled || this.props.player.money < 1000 || !!this.props.player.fakeDocuments} onClick={this.props.actions.buyFakeDocuments}>
            <span aria-label="fake documents cost 1000 money" role="img">📜</span>
          </button>
        </div>
        <Dice roll={this.props.roll} rollToggle={this.props.rollToggle}/>
      </section>
    )
  }
};
