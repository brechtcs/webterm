import minimist from './vendor/minimist-v1.2.0.js'

export function joinPath (left, right) {
  left = (left || '').toString()
  right = (right || '').toString()
  if (left.endsWith('/') && right.startsWith('/')) {
    return left + right.slice(1)
  }
  if (!left.endsWith('/') && !right.startsWith('/')) {
    return left + '/' + right
  }
  return left + right
}

export function parseCommand (str) {
  // parse the command
  var parts = str.split(' ')
  var cmd = parts.shift()

  // form the args list
  var opts = minimist(parts)
  var args = opts._
  delete opts._

  return {cmd, args, opts}
}

export function parseUrl (url) {
  if (!url.startsWith('dat://')) url = 'dat://' + url
  let urlp = new URL(url)
  let archive = new DatArchive(urlp.hostname)
  return {url, host: urlp.hostname, pathname: urlp.pathname || '/', archive}
}
