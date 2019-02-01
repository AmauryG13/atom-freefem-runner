'use babel'

const etch = require('etch')

export default class FreefemRunnerView {
  static URI = 'freefem-runner://output-view'

  isDestroyed = false
  isVisible = false
  element = HTMLElement

  constructor(items) {
    this.element = document.createElement('div')
    this.element.classList.add('freefem-runner', 'output')

    this.items = items
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
    const children = []
    const itemCount = this.items.length

    for (let i = 0; i < itemCount; i++) {
      const item = this.items[i];

      children.push(
        etch.dom(
          'div',
          {
            id: 'row'
          },
          etch.dom(
            'pre', {}, item.output
          )
        )
      )
    }

    return etch.dom(
      'div',
      {
        id: 'freefem-runner output',
      },
      etch.dom(
        'div',
        {
          style: {
            'height': '100%',
            'margin': '0px 5px 0px 5px',
            'overflow-y': 'scroll',
          }
        },
        ...children
      )
    )
  }

  update (props) {
    this.parseOutput(props)
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

  parseOutput(props) {
    //props.output = props.output.replace(/\n/gi, ' <br>')
    this.items.push(props)
  }

  clearItems() {
    l = this.items.length;
    this.items.splice(1, l-1)
  }
}
