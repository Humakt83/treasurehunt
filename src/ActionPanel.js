import React from 'react';
import './ActionPanel.scss';

export default class ActionPanel extends React.Component {

  render() {
    return (
      <section>
        <div className="action-panel">
          <button>
            <span aria-label="roll" role="img">🎲</span>
          </button>
          <button>
            <span aria-label="helicopter" role="img">🚁</span>
          </button>
          <button>
            <span aria-label="sleep" role="img" onClick={this.props.actions.skip}>😴</span>
          </button>
        </div>
      </section>
    )
  }
};
