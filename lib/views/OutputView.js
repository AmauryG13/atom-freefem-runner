'use babel'

export default class OutputView {
  static URI = 'freefempp-runner://output-view'
  isDestroyed = false

  constructor() {
    this.element = document.createElement('div')
    this.element.classList.add('freefempp-runner', 'output')
    //this.render()
  }

  getURI() {
    return OutputView.URI
  }

  getTitle() {
    return 'FreeFem++ Runner'
  }

  getDefaultLocation() {
    return 'bottom'
  }

  serialize() {
    return {
      deserializer: 'freefempp-runner/output-view'
    }
  }

  async show() {
    const focusedPane = atom.workspace.getActivePane()
    await atom.workspace.open(this, {
      activatePane: true
    })
    if (focusedPane && !focusedPane.isDestroyed()) focusedPane.activate()
  }

  hide() {
    atom.workspace.hide(this)
  }

  render() {
    //ReactDOM.render(<Root container={this} />, this.element)
  }

  toggle() {
    atom.workspace.toggle(this)
  }

  destroy() {
    //ReactDOM.unmountComponentAtNode(this.element)
    this.element.remove()
    this.isDestroyed = true
  }
}
