/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import instantiateReactComponent from './instantiateReactComponent'
import { ReactEvent } from './EventEmitter'

export default class ReactCompositeComponent {
  constructor(element) {
    this._currentElement = element
    this._rootNodeID = null
    this._instance = null
  }

  mountComponent(rootID) {
    this._rootNodeID = rootID
    const { type, props } = this._currentElement
    const { children = [] } = props

    const componentConstructor = type
    const instance = new componentConstructor(props)
    this._instance = instance
    instance._reactInternalInstance = this

    instance.componentWillMount && instance.componentWillMount()

    const renderedElement = this._instance.render()
    const renderedComponentInstance = instantiateReactComponent(renderedElement)

    this._renderedComponent = renderedComponentInstance

    const renderedMarkup = renderedComponentInstance.mountComponent(this._rootNodeID)

    ReactEvent.on('mountReady', () => {
      instance.componentDidMount && instance.componentDidMount()
    })

    return renderedMarkup
  }
}
