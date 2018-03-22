/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import ReactDOMTextComponent from './ReactDOMTextComponent'
import ReactDOMComponent from './ReactDOMComponent'
import ReactCompositeComponent from './ReactCompositeComponent'
import ReactClass from './ReactClass'

/**
 * Unique rentry to instantiate a react component
 * @param {ReactElement} element
 * @returns {*}
 */
export default function instantiateReactComponent(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return new ReactDOMTextComponent(element)
  }
  const { type, props } = element
  if (typeof element === 'object' && typeof type === 'string') {
    return new ReactDOMComponent(element)
  }
  if (typeof element === 'object' && typeof type === 'function') {
    if (Object.getPrototypeOf(type) === ReactClass) {
      return new ReactCompositeComponent(element)
    }
    return new ReactDOMComponent(type(props))
  }
}
