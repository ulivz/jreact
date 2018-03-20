/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import { delegate, undelegate } from './DOMUtil'
import instantiateReactComponent from './instantiateReactComponent'

export default class ReactDOMComponent {
  constructor(element) {
    this._currentElement = element
    this._rootNodeID = null
  }

  mountComponent(rootID) {
    this._rootNodeID = rootID;
    const { type, props } = this._currentElement
    const { children = [] } = props

    let openTag = `<${type}`
    let closeTag = `</${type}>`

    openTag += ` data-reactid=${this._rootNodeID}`

    for (const [propKey, propValue] of Object.entries(props)) {

      // Handle binding event.
      if (/^on[A-Za-z]/.test(propKey)) {
        const eventType = propKey.replace('on', '')
        delegate(document, `[data-reactid="${this._rootNodeID}"]`, eventType + '.' + this._rootNodeID, propValue)
      }

      if (propValue && propKey != 'children' && !/^on[A-Za-z]/.test(propKey)) {
        openTag += ' ' + propKey + '=' + propValue;
      }
    }

    let content = ''
    const childrenInstances = []

    for (const [index, child] of children.entries()) {
      const childComponentInstance = instantiateReactComponent(child)
      childComponentInstance._mountIndex = index

      childrenInstances.push(childComponentInstance)
      const childRootId = this._rootNodeID + '.' + index
      const childMarkup = childComponentInstance.mountComponent(childRootId)
      content += ' ' + childMarkup
    }

    this._renderedChildren = childrenInstances
    return openTag + '>' + content + closeTag
  }

  receiveComponent(nextElement) {
    const { props } = this._currentElement
    const nextProps = nextElement.props
    this._currentElement = nextElement

    this._updateDOMProperties(props, nextProps)
    // this._updateDOMChildren(nextElement.props.children)
  }

  _updateDOMProperties(prevProps, nextProps) {

    const selector = `[data-reactid="${this._rootNodeID}"]`

    for (const [propKey, propValue] of Object.entries(prevProps)) {
      if (nextProps.hasOwnProperty(propKey)) {
        continue
      }
      if (/^on[A-Za-z]/.test(propKey)) {
        const eventType = propKey.replace('on', '')
        undelegate(document, selector, eventType, propValue)
        continue
      }
      document.querySelector(selector).removeAttribute(propKey)
    }

    for (const [propKey, propValue] of Object.entries(nextProps)) {
      if (/^on[A-Za-z]/.test(propKey)) {
        const eventType = propKey.replace('on', '')
        propValue && undelegate(document, selector, eventType, propValue)
        delegate(document, selector, eventType + '.' + this._rootNodeID, propValue)
        continue
      }
      if (propKey === 'children') continue
      document.querySelector(selector).setAttribute(propKey, propValue)
    }
  }
}
