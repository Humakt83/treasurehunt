import React from 'react';
import './ActionPanel.scss';
import Dice from './Dice';
import HelpModal from '../modals/HelpModal';

export default class ActionPanel extends React.Component {

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {showHelp: false};
    this.showHelp = this.showHelp.bind(this);
    this.hideHelp = this.hideHelp.bind(this);
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case 82:
        if (!this.actionsDisabled()) {
          this.props.actions.roll();
        }
        break;
      case 83:
        if (!this.skipIsDisabled()) {
          this.props.actions.skip();
        }
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  actionsDisabled() {
    return this.props.disabled;
  }

  shipDisabled() {
    return this.actionsDisabled() || this.props.player.money < 300;
  }

  helicopterDisabled() {
    return this.actionsDisabled() || this.props.player.money < 1000
  }

  buyFakeDocumentsDisabled() {
    return this.actionsDisabled() || this.props.player.onVolcano || this.props.player.money < 1000 || !!this.props.player.fakeDocuments;
  }

  skipIsDisabled() {
    return this.actionsDisabled() || this.props.player.onVolcano
  }

  showHelp() {
    this.setState({showHelp: true});
  }

  hideHelp() {
    this.setState({showHelp: false});
  }

  render() {
    const helpModal = this.state.showHelp ? <HelpModal closeHelp={this.hideHelp} /> : '';
    return (
      <section>
        <div className="action-panel">
          <button disabled={this.actionsDisabled()} onClick={this.props.actions.roll}>
            <span aria-label="roll" role="img">🎲</span>
          </button>
          <button disabled={this.shipDisabled()} onClick={this.props.actions.ship}>
            <span aria-label="ship costs 300" role="img">🛶</span>
          </button>
          <button disabled={this.helicopterDisabled()} onClick={this.props.actions.helicopter}>
            <span aria-label="helicopter costs 1000" role="img">🚁</span>
          </button>
          <button onClick={this.props.actions.skip} disabled={this.skipIsDisabled()}>
            <span aria-label="work to earn 100 money" role="img">🔨</span>
          </button>
          <button disabled={this.buyFakeDocumentsDisabled() } onClick={this.props.actions.buyFakeDocuments}>
            <span aria-label="fake documents cost 1000 money" role="img">📜</span>
          </button>
          <button onClick={this.showHelp}>
            <span aria-label="help" role="img">❓</span>
          </button>
        </div>
        <Dice roll={this.props.roll} rollToggle={this.props.rollToggle}/>
        {helpModal}
      </section>
    )
  }
};
