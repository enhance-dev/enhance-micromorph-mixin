import diff from 'micromorph'
const parser = new DOMParser()

function cloneAttrs(source, target) {
  [...source.attributes].forEach(attr => target.setAttribute(attr.nodeName ,attr.nodeValue))
}
const MicromorphMixin = (superclass) => class extends superclass {
  constructor() {
    super()
    this.process = this.process.bind(this)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.process()
    }
  }

  process() {
    const tmp = this.render({
      html: this.html,
      state: this.state
    })

    const updated = parser.parseFromString(
      `<${this.tagName}>
        ${tmp.trim()}
      </${this.tagName}>
      `,
      'text/html'
    ).body.firstChild

    cloneAttrs(this, updated)

    diff(
      this,
      updated
    )
  }
}
export default MicromorphMixin
