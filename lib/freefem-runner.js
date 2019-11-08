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

const intro = [{output: '-- FreeFEM Runner (for Atom)'}]

export default {

  freefemOutputView: null,
  dockPanel: null,
  subscriptions: null,

  config: {
    path: {
      'type': 'string',
      'description': 'Path to the FreeFEM executable',
      'default': 'FreeFem++'
    }
  },

  process: undefined,
  isRunning: false,

  activate() {
    atom.workspace.addOpener(uri => {
      if (uri === FreefemOutputView.URI) {
        if (!this.freefemOutputView || this.freefemOutputView.isDestroyed) this.freefemOutputView = new FreefemOutputView(intro)
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
        'freefem-runner:compile': () => this.launchCompilation(),
        'freefem-runner:stop': () => this.stopCompilation()
      })
    )
  },

  deserializeFreefemOutputView() {
    if (!this.freefemOutputViewoutputView) this.freefemOutputViewoutputView = new FreefemOutputView(intro)
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

    this.freefemOutputView.render()
  },

  launchCompilation() {
    this.isRunning = true
    this.freefemOutputView.render()

    exe = (atom.config.get('freefem-runner')).path
    file = currentFile(atom.workspace.getActiveTextEditor())

    if (file.extension !== '.edp') {
      atom.notifications.addError('Compilation aborted', {
        description: `File '${file.name}'' extension (${file.extension}) doesn't match FreeFEM file`
      })

      return
    }

    this.process = runner(exe, file.name, {
      cwd: file.path,
      detached: true,
      stdin: [
        'ignore',
        'pipe',
        openSync(`${file.path}${path.sep}error.log`, 'w')
    ]})

    this.process.unref()

    this.freefemOutputView.show()
    this.freefemOutputView.clearItems();
    this.freefemOutputView.update({output: `File: ${file.name}`})

    this.process.stdout.on('data', (data) => {
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

      this.freefemOutputView.scrollDown()
    })

    this.process.on('close', () => {
      this.freefemOutputView.scrollDown()
      this.isRunning = false
    })
  },

  stopCompilation() {
    if (this.process == undefined || this.isRunning == false)
    {
      atom.notifications.addWarning("Not compilation to stop")
    } else {
      try {
        this.process.kill()
        this.isRunning = false
        this.freefemOutputView.update({
          output: '##### This compilation has been canceled ...'
        })
        atom.notifications.addSuccess("Compilation stoped")
      } catch (error) {
        atom.notifications.addFatalError("Compilation stoping error !!!", {
          description: `${error}`
        })
      }

    }
  }
}
