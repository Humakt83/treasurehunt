import React from 'react';
import './EncounterModal.scss';

export default class EncounterModal extends React.Component {

  render() {
    const emoji = this.props.encounter.emoji ? <p className="modal-emoji">{this.props.encounter.emoji}</p> : '';
    return (
      <section>
        <div className="modal-container">
          <div className="modal">
            {emoji}
            <p>{this.props.encounter.message}</p>
            <button className="confirmButton" onClick={this.props.encounter.continue}>OK</button>
          </div>
        </div>
      </section>
    )
  }
};
