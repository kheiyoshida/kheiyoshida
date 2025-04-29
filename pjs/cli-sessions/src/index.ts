/* eslint-disable no-console */
import { startReplSession } from '@mgnr/cli'

const sessionId = process.argv[2]

if (!sessionId) {
  console.error('provide session name as argument')
  process.exit(1)
}

const sessionSetup = (await import(`sessions/${sessionId}`)).default
startReplSession(sessionSetup)
