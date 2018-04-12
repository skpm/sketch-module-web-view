var { JS_BRIDGE } = require('./lib/constants')

module.exports = function(actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }

  if(window[JS_BRIDGE] && typeof window[JS_BRIDGE].callNative === 'function') {
    window[JS_BRIDGE].callNative(
      JSON.stringify([].slice.call(arguments))
    )
  }
}
