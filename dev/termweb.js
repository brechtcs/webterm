import * as env from './env-default.js'
import hast from './vendor/hastscript-v5.0.0.js'
import hyperx from './vendor/hyperx-v2.5.0.js'
import visit from './vendor/unist-util-visit-v1.4.0.js'
import {noop, parseCommand} from './util.js'

var builtins = {
  html: hyperx(hast),
  morph: noop,
  evalCommand: evalCommand,
  getCWD: () => Object.create(null),
  setCWD: noop
}

window.env = Object.assign(builtins, env)
window.onmessage = evalCommand
setTimeout(updatePrompt)

function appendError (err) {
  console.error(err)
}

function appendOutput (out) {
  if (typeof out === 'undefined') {
    console.log('Ok.')
  } else if (typeof out.toHTML === 'function') {
    var tree = out.toHTML()
    visit(tree, 'text', node => console.log(node.value))
  } else {
    console.log(out)
  }
}

async function evalCommand (msg) {
  try {
    var command = msg.data.toString().trim()
    var res = await eval(parseCommand(command))
    appendOutput(res)
  } catch (err) {
    appendError(err)
  } finally {
    updatePrompt()
  }
}

function updatePrompt () {
  window.postMessage('> ')
}