import React from 'react';
import './Dice.scss';

export default class Dice extends React.Component {

  render() {
    const oddOrEvenClass = this.props.rollToggle ? 'die-list even-roll': 'die-list odd-roll';
    return (
      <section>
        <ol className={oddOrEvenClass} data-roll={this.props.roll}>
          <li className="die-item" data-side="1">
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="2">
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="3">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="4">
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="5">
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="6">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
        </ol>
      </section>
    )
  }
};
