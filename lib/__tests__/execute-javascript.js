/* globals test, expect */
const { wrapScript } = require('../execute-javascript')

test('should wrap a script correctly', () => {
  expect(wrapScript(`setRandomNumber(3)`, 1)).toBe(
    'window.__skpm_executeJS(1, "setRandomNumber(3)")'
  )
  const argument = { json: JSON.stringify({ a: 'a' }) }
  const script = `console.log(${JSON.stringify(argument)});`
  expect(wrapScript(script, 2)).toBe(
    'window.__skpm_executeJS(2, "console.log({\\"json\\":\\"{\\\\\\"a\\\\\\":\\\\\\"a\\\\\\"}\\"});")'
  )
})
