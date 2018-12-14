'use babel';

import FreefemppRunnerView from './freefempp-runner-view';
import { CompositeDisposable } from 'atom';

export default {

  freefemppRunnerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.freefemppRunnerView = new FreefemppRunnerView(state.freefemppRunnerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.freefemppRunnerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'freefempp-runner:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.freefemppRunnerView.destroy();
  },

  serialize() {
    return {
      freefemppRunnerViewState: this.freefemppRunnerView.serialize()
    };
  },

  toggle() {
    console.log('FreefemppRunner was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
