'use babel';
/** @jsx etch.dom */

import etch from 'etch'

export default class FreefemRunnerView {
  static URI = 'freefem-runner://output-view'

  isDestroyed = false
  isVisible = false
  element = HTMLElement

  constructor(props) {
    this.element = document.createElement('div')
    this.element.classList.add('freefem-runner', 'output')

    this.properties = props
    etch.initialize(this)
  }

  getURI() {
    return FreefemRunnerView.URI
  }

  getTitle() {
    return 'FreeFem++ Runner'
  }

  getDefaultLocation() {
    return 'bottom'
  }

  serialize() {
    return {
      deserializer: 'freefem-runner/output-view'
    }
  }

  // Lifecycle
  render() {
    return <div></div>
  }

  update (props) {
    this.properties = props
    etch.update(this)
  }

  destroy() {
    this.element.remove()
    this.isDestroyed = true
  }

  //
  async show() {
    console.log('View: show()')
    const focusedPane = atom.workspace.getActivePane()
    await atom.workspace.open(this, { activatePane: true })
    if (focusedPane && !focusedPane.isDestroyed()) focusedPane.activate()
    this.isVisible = true
  }

  hide() {
    console.log('View: hide()')
    atom.workspace.hide(this)
    this.isVisible = false
  }

  toggle() {
    console.log('View: toggle()')
    atom.workspace.toggle(this)
  }

}
