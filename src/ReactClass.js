/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

export default class ReactClass {
  render() {

  }

  setState(newState) {
    this._reactInternalInstance.receiveComponent(null, newState)
  }
}
