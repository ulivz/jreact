/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

import instantiateReactComponent from './instantiateReactComponent'
import shouldUpdateReactComponent from './shouldUpdateReactComponent'
import { ReactEvent } from './EventEmitter'
import { replaceWith } from './DOMUtil'

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

  receiveComponent(nextElement, newState) {
    this._currentElement = nextElement || this._currentElement
    const instance = this._instance
    const nextState = Object.assign(instance.state, newState)
    const nextProps = this._currentElement.props
    instance.state = nextState;

    const { shouldComponentUpdate, componentWillUpdate, componentDidUpdate } = instance
    if (shouldComponentUpdate && (shouldComponentUpdate(nextProps, nextState) === false)) return
    if (componentWillUpdate) componentWillUpdate(nextProps, nextState)

    const prevComponentInstance = this._renderedComponent
    const prevRenderedElement = prevComponentInstance._currentElement
    const nextRenderedElement = this._instance.render()

    // update
    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
      prevComponentInstance.receiveComponent(nextRenderedElement)
      componentDidUpdate && componentDidUpdate()

      // rerender
    } else {
      this._renderedComponent = instantiateReactComponent(nextRenderedElement)
      const nextMarkup = this._renderedComponent.mountComponent(this._rootNodeID)
      replaceWith(
        document.querySelector('[data-reactid="' + this._rootNodeID + '"]'),
        nextMarkup
      )
    }

  }
}
