module.exports = function (actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  var location = 'action://' + actionName + '.com'
  var args = [].slice.call(arguments).slice(1)
  if (args && args.length) {
    location += '?args=' + encodeURIComponent(JSON.stringify(args))
  }
  window.location = location
  return
}
