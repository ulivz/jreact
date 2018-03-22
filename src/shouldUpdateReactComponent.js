/**
 *
 * @param {Object} prevElement
 * @param {Object} nextElement
 * @returns {boolean}
 * @private
 */
export default function shouldUpdateReactComponent(prevElement, nextElement) {
  if (prevElement != null && nextElement != null) {
    const prevType = typeof prevElement
    const nextType = typeof nextElement
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number'
    } else {
      return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key
    }
  }
  return false
}
