/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

export default class ReactDOMTextComponent {
  constructor(text) {
    this._currentElement = '' + text
    this._rootNodeID = null
  }

  mountComponent(rootID) {
    this._rootNodeID = rootID
    return `<span data-reactid="${rootID}">${this._currentElement}</span>`
  }

  receiveComponent(nextText) {
    const nextStringText = '' + nextText
    if (nextStringText !== this._currentElement) {
      this._currentElement = nextStringText
      document.querySelector(`[data-reactid='${this._rootNodeID}']`).innerText = nextStringText
    }
  }
}
