import * as repl from 'node:repl'
import { main } from './session/1'

const replServer = repl.start()

const bound = main()

Object.assign(replServer.context, bound)
// replServer.context.start = main
