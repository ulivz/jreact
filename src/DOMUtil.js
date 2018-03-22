/*!
 * jreact v0.0.0
 * (c) 2016-2018 ULIVZ
 * Released under the MIT License.
 */

// IE10+ Support
// inspired by zepto event https://github.com/madrobby/zepto/blob/master/src/event.js

const handlers = {}
const specialEvents = {}
specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

// every element and callback function will have an unique dtId
let _dtId = 1;

/**
 * Get dtId of Element or callback function
 * @param  {Object|Function} obj Element or callback function
 * @return {Number} unique dtId
 */
function getDtId(obj) {
  return obj._dtId || (obj._dtId = _dtId++);
}

/**
 * Get event object of event string, the first `.` is used to split event and namespace
 *
 * @param  {String} event Event type string with namespace or not
 * @return {Object} An Object with `e` and `ns` key
 */
function parse(event) {
  const dotIndex = event.indexOf('.');
  if (dotIndex > 0) {
    return {
      e: event.substring(0, event.indexOf('.')),
      ns: event.substring(dotIndex + 1, event.length)
    };
  }

  return { e: event };
}

/**
 * Find matched event handlers
 * @param  {Element} el the element to find
 * @param  {String} selector Used by event delegation, null if not
 * @param  {String} event Event string may with namespace
 * @param  {Function} callback the callback to find, optional
 * @return {Array} Array of handlers bind to el
 */
function findHandlers(el, selector, event, callback) {
  event = parse(event);
  return (handlers[getDtId(el)] || []).filter(handler => {
    return handler
      && (!event.e || handler.e === event.e)
      && (!event.ns || handler.ns === event.ns)
      && (!callback || handler.callback === callback)
      && (!selector || handler.selector === selector);
  });
}

function removeEvent(el, selector, event, callback) {
  const eventName = parse(event).e;

  if (!el._dtId) return false;
  const elHandlers = handlers[getDtId(el)];
  const matchedHandlers = findHandlers(el, selector, event, callback);
  matchedHandlers.forEach(handler => {
    if (el.removeEventListener) {
      el.removeEventListener(eventName, handler.delegator || handler.callback);
    } else if (el.detachEvent) {
      el.detachEvent('on' + eventName, handler.delegator || handler.callback);
    }
    elHandlers.splice(elHandlers.indexOf(handler), 1);
  });
}

/**
 * Bind event.
 * @param {Element} el
 * @param {String} selector
 * @param {String} event
 * @param {Function} callback
 * @param delegator
 */
function bindEvent(el, selector, event, callback, delegator) {
  const eventName = parse(event).e;
  const ns = parse(event).ns;

  if (el.addEventListener) {
    el.addEventListener(eventName, delegator || callback, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + eventName, delegator || callback);
  }

  // push events to handlers
  const id = getDtId(el);
  const elHandlers = (handlers[id] || (handlers[id] = []));
  elHandlers.push({
    delegator: delegator,
    callback: callback,
    e: eventName,
    ns: ns,
    selector: selector
  });
}

/**
 * Register a callback
 *
 * @param  {Element} el the element to bind event to
 * @param  {String} eventType event type, can with namesapce
 * @param  {Function} callback callback to invoke
 * @return {Null} return null
 */
export function on(el, eventType, callback) {
  bindEvent(el, null, eventType, callback);
}

/**
 * Unregister a callback
 *
 * @param  {Element} el the element to bind event to
 * @param  {String} eventType event type, can with namesapce
 * @param  {Function} callback optional, callback to invoke
 * @return {Null} return null
 */
export function off(el, eventType, callback) {
  // find callbacks
  removeEvent(el, null, eventType, callback);
}

/**
 * Register a callback that will execute exactly once
 *
 * @param  {Element} el the element to bind event to
 * @param  {String} eventType event type, can with namesapce
 * @param  {Function} callback callback to invoke
 * @return {Null} return null
 */
export function once(el, eventType, callback) {
  const recursiveFunction = e => {
    off(e.currentTarget, e.type, recursiveFunction);
    return callback(e);
  };
  on(el, eventType, recursiveFunction);
}

// Delegate a callback to selector under el
export function delegate(el, selector, eventType, callback) {
  // bind event to el. and check if selector match
  const delegator = function (e) {
    const els = el.querySelectorAll(selector);
    let matched = false;
    for (let i = 0; i < els.length; i++) {
      const _el = els[i];
      if (_el === e.target || _el.contains(e.target)) {
        matched = _el;
        break;
      }
    }
    if (matched) {
      callback.apply(matched, [].slice.call(arguments));
    }
  };

  bindEvent(el, selector, eventType, callback, delegator);
}

// Undelegate a callback to selector under el
export function undelegate(el, selector, eventType, callback) {
  removeEvent(el, selector, eventType, callback);
}

// Dispatch an event with props to el
export function trigger(el, eventType, props) {
  const event = document.createEvent(specialEvents[eventType] || 'Events');
  let bubbles = true;
  if (props) {
    for (const name in props) {
      if ({}.hasOwnProperty.call(props, name)) {
        (name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
      }
    }
  }
  event.initEvent(eventType, bubbles, true);
  el.dispatchEvent(event);
}

export function replaceWith(el, nextEl) {
  const block = document.createElement('div')
  block.innerHTML = nextEl
  el.parentNode.insertBefore(block.childNodes[0], el)
  el.parentNode.removeChild(el)
}

export function insertChildAt(parentNode, newNode, index) {
  const referenceNode = parentNode.childNodes[index]
  referenceNode ? parentNode.insertBefore(newNode, referenceNode) : parentNode.appendChild(newNode)
}
