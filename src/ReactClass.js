/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

export default class ReactClass {
  constructor(props) {
    this.props = props
  }

  render() {

  }

  setState(newState) {
    this._reactInternalInstance.receiveComponent(null, newState)
  }
}
