import React from 'react';
import './HelpModal.scss';
import Info from '../setup/Info';

export default class HelpModal extends React.Component {

  componentDidMount() {
    this.confirmButton.focus();
  }

  render() {
    return (
      <section>
        <div className="modal-container">
          <div className="help-modal">
            <Info />
            <br />
            <button 
              ref={(button) => this.confirmButton = button}
              className="confirmButton"
              onClick={this.props.closeHelp}>
              OK
            </button>
          </div>
        </div>
      </section>
    )
  }
};
