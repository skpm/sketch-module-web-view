module.exports = function(actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  window.sketchBridge.callNative(JSON.stringify([].slice.call(arguments)))
}
