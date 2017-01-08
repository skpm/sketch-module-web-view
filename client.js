module.exports = function (actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  var args = [].slice.call(arguments).slice(1)
  var previousHash = (window.location.hash.split('?')[1] ? window.location.hash.split('?')[0] : window.location.hash)
  window.location.hash = previousHash +
    '?pluginAction=' + encodeURIComponent(actionName) +
    '&actionId=' + Date.now() +
    '&pluginArgs=' + encodeURIComponent(JSON.stringify(args))
  return
}
