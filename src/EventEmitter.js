/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

export default class EventEmitter {
  on(eventName, handler) {
    const realEventKey = `_${eventName}`
    if (!this[realEventKey]) {
      this[realEventKey] = []
    }
    this[realEventKey].push(handler)
    return this
  }

  emit(eventName, ...params) {
    const realEventKey = `_${eventName}`
    if (this[realEventKey]) {
      for (let handler of this[realEventKey]) {
        handler && handler(...params)
      }
    }
    return this
  }

  off(eventName) {
    const realEventKey = `_${eventName}`
    if (this[realEventKey]) {
      delete this[realEventKey]
    }
    return this
  }
}

export const ReactEvent = new EventEmitter()


