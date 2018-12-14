'use babel';

import FreefemppRunnerView from './freefempp-runner-view';
import { CompositeDisposable } from 'atom';

import Config from './config'
import Runner from './runner'
import Notif from './notif'

import utils from './utils'

export default {

  freefemppRunnerView: null,
  modalPanel: null,
  subscriptions: null,

  config: Config,

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
      'freefempp-runner:toggle': () => this.toggle(),
      'freefempp-runner:run': () => this.run()
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
  },

  run() {
      let executable = (atom.config.get('freefempp-runner')).path
      let currentFile = (atom.workspace.getActiveTextEditor()).getPath()

      let file = utils.parseFileInfo(currentFile)

      Notif.info("Compilation", `Path: ${file.path} <br> File: ${file.name}`)
      output = Runner(executable, file.name, file.path)

      output.stdout.on('data', (data) => {
          console.log(`${data}`)
      })

      output.stderr.on('data', (data) => {
          console.warn(`${data}`)
      })

      output.on('close', (code) => {
          console.log(`${code}`)
      })
  }

};
