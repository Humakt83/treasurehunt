import React from 'react';
import './ActionPanel.scss';

export default class ActionPanel extends React.Component {

  render() {
    return (
      <section>
        <div className="action-panel">
          <button disabled={this.props.disabled} onClick={this.props.actions.roll}>
            <span aria-label="roll" role="img">🎲</span>
          </button>
          <button disabled={this.props.disabled || this.props.money < 300} onClick={this.props.actions.ship}>
            <span aria-label="ship costs 300" role="img">🛶</span>
          </button>
          <button disabled={this.props.disabled || this.props.money < 1000} onClick={this.props.actions.helicopter}>
            <span aria-label="helicopter costs 1000" role="img">🚁</span>
          </button>
          <button onClick={this.props.actions.skip} disabled={this.props.disabled}>
            <span aria-label="work to earn 100 money" role="img">🔨</span>
          </button>
        </div>
      </section>
    )
  }
};
