/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import ReactDOMTextComponent from './ReactDOMTextComponent'
import ReactDOMComponent from './ReactDOMComponent'

export default function instantiateReactComponent(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return new ReactDOMTextComponent(vnode);
  }
  if (typeof vnode === 'object' || typeof vnode.type === 'number') {
    return new ReactDOMComponent(vnode);
  }
}
