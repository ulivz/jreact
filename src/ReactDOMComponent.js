/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import { delegate, undelegate } from './DOMUtil'
import instantiateReactComponent from './instantiateReactComponent'

const UPATE_TYPES = {
  MOVE_EXISTING: 1,
  REMOVE_NODE: 2,
  INSERT_MARKUP: 3
}

let updateDepth = 0
let diffQueue = []

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
      // _mountIndex uses for diff
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
    this._updateDOMChildren(nextElement.props.children)
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

  _updateDOMChildren(nextChildrenElements) {
    updateDepth++
    this._diff(diffQueue, nextChildrenElements);
    updateDepth--
    if (updateDepth === 0) {
      this._patch(diffQueue)
      diffQueue = [];
    }
  }

  _diff(diffQueue, nextChildrenElements) {
    const prevChildren = flattenChildren(this._renderedChildren)
    const nextChildren = generateComponentChildren(prevChildren, nextChildrenElements)

    this._renderedChildren = nextChildren.slice(0)

    let lastIndex = 0
    let nextIndex = 0

    for (const [name, nextChild] of Object.entries(nextChildren)) {
      const prevChild = prevChildren && prevChildren[name];
      // Same component, need to do move operation.
      if (prevChild === nextChild) {
        prevChild._mountIndex < lastIndex && diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: document.querySelector('[data-reactid=' + this._rootNodeID + ']'),
          type: UPATE_TYPES.MOVE_EXISTING,
          fromIndex: prevChild._mountIndex,
          toIndex: nextIndex
        })
        lastIndex = Math.max(prevChild._mountIndex, lastIndex);
      }

      // New node
      else {
        if (prevChild) {
          diffQueue.push({
            parentId: this._rootNodeID,
            parentNode: document.querySelector('[data-reactid=' + this._rootNodeID + ']'),
            type: UPATE_TYPES.REMOVE_NODE,
            fromIndex: prevChild._mountIndex,
            toIndex: null
          })

          if (prevChild._rootNodeID) {
            undelegate(document, '.' + prevChild._rootNodeID);
          }

          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
        }

        diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: document.querySelector('[data-reactid=' + this._rootNodeID + ']'),
          type: UPATE_TYPES.INSERT_MARKUP,
          fromIndex: null,
          toIndex: nextIndex,
          markup: nextChild.mountComponent(this._rootNodeID + '.' + name)
        })
      }
      nextChild._mountIndex = nextIndex;
      nextIndex++;
    }

    for (const [name, prevChild] of Object.entries(prevChildren)) {
      if (!(nextChildren && nextChildren.hasOwnProperty(name))) {
        diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: document.querySelector('[data-reactid=' + this._rootNodeID + ']'),
          type: UPATE_TYPES.REMOVE_NODE,
          fromIndex: prevChild._mountIndex,
          toIndex: null
        })
        if (prevChild._rootNodeID) {
          undelegate(document, '.' + prevChild._rootNodeID);
        }
      }
    }
  }
}


function flattenChildren(componentChildren) {
  const childrenMap = {}

  for (let [index, child] of componentChildren.entries()) {
    const { _currentelement } = child
    const name = child && _currentelement && _currentelement.key
      ? _currentelement.key
      : index.toString(36)
    childrenMap[name] = child
  }

  return childrenMap
}


/**
 *
 * @param {Object} prevChildren
 * @param {Array} nextChildrenElements
 * @returns {Object}
 */
function generateComponentChildren(prevChildren, nextChildrenElements) {
  const nextChildren = {}
  nextChildrenElements = nextChildrenElements || []

  for (const [index, element] of nextChildrenElements.entries()) {
    const name = element.key || index
    const prevChild = prevChildren && prevChildren[name]
    const prevChildElement = prevChild && prevChild._currentElement
    const nextChildElement = element

    if (_shouldUpdateReactComponent(prevChildElement, nextChildElement)) {
      prevChild.receiveComponent(nextChildElement);
      nextChildren[name] = prevChild
    } else {
      const nextChildInstance = instantiateReactComponent(nextChildElement)
      nextChildren[name] = nextChildInstance
    }
  }

  return nextChildren;
}

/**
 *
 * @param {Object} prevElement
 * @param {Object} nextElement
 * @returns {boolean}
 * @private
 */
function _shouldUpdateReactComponent(prevElement, nextElement) {
  if (prevElement != null && nextElement != null) {
    const prevType = typeof prevElement;
    const nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number'
    } else {
      return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key
    }
  }
  return false
}
