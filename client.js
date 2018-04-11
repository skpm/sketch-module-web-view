var CONSTANTS = require('./lib/constants')

module.exports = function(actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  window[CONSTANTS.JS_BRIDGE].callNative(
    JSON.stringify([].slice.call(arguments))
  )
}
