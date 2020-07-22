import React from 'react';
import './EncounterModal.scss';

export default class EncounterModal extends React.Component {

  render() {
    return (
      <section>
        <div className="modal-container">
          <div className="modal">
            <p>{this.props.encounter.message}</p>
            <button className="confirmButton" onClick={this.props.encounter.continue}>OK</button>
          </div>
        </div>
      </section>
    )
  }
};
