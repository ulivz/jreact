/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import instantiateReactComponent from './instantiateReactComponent'
import { ReactEvent } from './EventEmitter'

export let nextReactRootIndex = 0

export function render(element, container) {
  const componentInstance = instantiateReactComponent(element)
  const markup = componentInstance.mountComponent(nextReactRootIndex++)
  container.innerHTML = markup
  setTimeout(() => {
    // componentInstance.receiveComponent({ props: { class: 'app', app: '123' } })
  }, 1000)
  ReactEvent.emit('mountReady')
}

export default {
  nextReactRootIndex,
  render
}
