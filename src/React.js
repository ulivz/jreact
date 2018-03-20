/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import ReactElement from './ReactElement'

function createElement(type, config, children) {
  const props = {}
  const key = config.key || null // Used for efficient update.

  config = config || {}

  for (let [propName, propValue] of Object.entries(config)) {
    if (propName !== 'key') {
      props[propName] = propValue
    }
  }

  const childrenLength = arguments.length - 2

  if (childrenLength === 1) {
    props.children = Array.isArray(children) ? children : [children]
  } else if (childrenLength > 1) {
    const childrenArray = Array(childrenLength)
    for (let i = 0, l = childrenLength; i < l; i++) {
      childrenArray[i] = arguments[i + 2]
    }
    props.children = childrenArray
  }
  return new ReactElement(type, key, props)
}

export default {
  createElement
}
