import * as repl from 'node:repl'
import { main } from './session/2'

function startCliSession() {
  try {
    console.clear()
    const replServer = repl.start()
    const bound = main()
    Object.assign(replServer.context, bound)
  } catch (err) {
    console.error(err)
  }
}

startCliSession()