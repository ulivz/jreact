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
    return `<span data-jid="${rootID}">${this._currentElement}</span>`
  }

  receiveComponent(nextText) {
    const nextStringText = '' + nextText
    if (nextStringText !== this._currentElement) {

    }
  }
}


ReactDOMTextComponent.prototype.receiveComponent = function (nextText) {
  var nextStringText = '' + nextText;
  //跟以前保存的字符串比较
  if (nextStringText !== this._currentElement) {
    this._currentElement = nextStringText;
    //替换整个节点
    $('[data-reactid="' + this._rootNodeID + '"]').html(this._currentElement);

  }
}
