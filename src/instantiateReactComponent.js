/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import ReactDOMTextComponent from './ReactDOMTextComponent'

export default function instantiateReactComponent(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return new ReactDOMTextComponent(vnode);
  }
}
