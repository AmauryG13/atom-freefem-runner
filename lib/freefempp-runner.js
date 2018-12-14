'use babel';

import OutputView from './views/OutputView';
import { CompositeDisposable } from 'atom';

import Config from './config'
import Runner from './runner'
import Notif from './notif'

import utils from './utils'

export default {

  OutputView: null,
  subscriptions: new CompositeDisposable(),

  config: Config,

  activate(state) {
    atom.workspace.addOpener(uri => {
      if (uri === OutputView.URI) {
        if (!this.OutputView || this.OutputView.isDestroyed) this.OutputView = new OutputView()
        return this.OutputView
      }
    })

    atom.workspace.open(OutputView.URI, { activatePane: false, activateItem: false })

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'freefempp-runner:toggle': () => this.toggle(),
      'freefempp-runner:run': () => this.run()
    }))
  },

  deserializeOutputView(_state) {
    if (!this.OutputView) this.OutputView = new OutputView()
    return this.OutputView
  },

  deactivate() {
    this.subscriptions.dispose();
    this.OutputView.destroy();
  },

  serialize() {
    return {
      OutputView: this.OutputView.serialize()
    };
  },

  toggle() {
    console.log('FreefemppRunner was toggled!');
    return (
      this.OutputView.toggle()
    );
  },

  run() {
      let executable = (atom.config.get('freefempp-runner')).path
      let currentFile = (atom.workspace.getActiveTextEditor()).getPath()

      let file = utils.parseFileInfo(currentFile)

      output = Runner(executable, file.name, file.path)

      this.OutputView.toggle()

      output.stdout.on('data', (data) => {
          if ((data.toString()).startsWith('--')) {
              let version = (data.toString()).substr(0, data.indexOf('(')-1)

              Notif.info("Compilation",
                  `${version} <br>
                  File: ${file.name} <br>
                  Path: ${file.path}`
              )
          }

          this.OutputView.element.innerHTLM(data)

          if ((data.toString()).includes('Error')) {
              Notif.error('Compilation failed', `${data}`)
          }

          if ((data.toString()).includes('times:')) {
              stdout = data.toString()
              times = stdout.substr(stdout.indexOf(':')+1, stdout.length).replace(/,/g,'<br>')

              Notif.success('Compilation successful', times)
          }
      })
  }

};
