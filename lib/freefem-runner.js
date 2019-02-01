'use babel';

import FreefemOutputView from './freefem-runner-view'
import { CompositeDisposable } from 'atom'

import { spawn } from 'child_process'
import { openSync } from 'fs'
import path from 'path'

const runner = (executable, file, options) => {
  return spawn(executable, [file], options)
}

const currentFile = (editor) => {
  if(!editor) return null

  filepath = editor.getPath()
  return {
    name: path.basename(filepath),
    extension: path.extname(filepath),
    path: path.dirname(filepath)
  }
}

export default {

  freefemOutputView: null,
  dockPanel: null,
  subscriptions: null,

  config: {
    path: {
      'type': 'string',
      'description': 'Path to the FreemFem++ executable',
      'default': 'FreeFem++'
    }
  },

  activate() {
    atom.workspace.addOpener(uri => {
      if (uri === FreefemOutputView.URI) {
        if (!this.freefemOutputView || this.freefemOutputView.isDestroyed) this.freefemOutputView = new FreefemOutputView([{output: '-- FreeFem++ Runner (for Atom)'}])
        return this.freefemOutputView
      }
    })

    this.dockPanel = atom.workspace.open(FreefemOutputView.URI, { activatePane: false, activateItem: false });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'freefem-runner:toggle': () => this.toggle(),
        'freefem-runner:compile': () => this.launchCompilation()
      })
    )
  },

  deserializeFreefemOutputView() {
    if (!this.freefemOutputViewoutputView) this.freefemOutputViewoutputView = new FreefemOutputView([{output: '-- FreeFem++ Runner (for Atom)'}])
    return this.freefemOutputViewoutputView
  },

  deactivate() {
    this.dockPanel.destroy()
    this.subscriptions.dispose()
    this.freefemOutputView.destroy()
  },

  toggle() {
    this.freefemOutputView.isVisible ?
      this.freefemOutputView.hide() :
      this.freefemOutputView.show()
  },

  launchCompilation() {
    exe = (atom.config.get('freefem-runner')).path
    file = currentFile(atom.workspace.getActiveTextEditor())
    console.log(file)

    if (file.extension !== '.edp') {
      atom.notifications.addError('Compilation aborted', {
        description: `File '${file.name}'' extension (${file.extension}) doesn't match FreeFem++ file`
      })

      return
    }

    process = runner(exe, file.name, {cwd: file.path,
                                      detached: true,
                                      stdin: [
                                        'ignore',
                                        'pipe',
                                        openSync(`${file.path}\\errror.log`, 'w')
                                      ]})

    process.unref()

    this.freefemOutputView.show()
    //this.freefemOutputView.clearItems();
    this.freefemOutputView.update({output: `File: ${file.name}`})

    process.stdout.on('data', (data) => {
      console.log(`${data}`)
      output = data.toString()

      if (output.includes('-- FreeFem++')) {
        let version = output.substr(0, output.indexOf('(') - 1)

        atom.notifications.addInfo("Compilation ...", {
          description: `Version: ${version} <br> File: ${file.name} <br> Path: ${file.path}`
        })
      }

      this.freefemOutputView.update({output: output})

      if (output.includes('Error')) {
        atom.notifications.addError("Compilation failed", {
          description: `${output.replace(/\n/g, '<br>')}`
        })
      }
    })

  }

}
