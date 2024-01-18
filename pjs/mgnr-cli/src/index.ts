import * as repl from 'node:repl'
import { main } from './session/1'

function startCliSession() {
  try {
    const replServer = repl.start()
    const bound = main()
    Object.assign(replServer.context, bound)
  } catch (err) {
    console.error(err)
  }
}

startCliSession()