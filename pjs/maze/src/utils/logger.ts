/* eslint-disable no-console */

interface Logger {
  log: (...args: unknown[]) => void
}

export const logger: Logger = (() => {
  if (process.env.DEBUG === 'true') {
    console.log('DEBUG MODE')
    return {
      log: (...args) => {
        console.log(...args)
      },
    }
  }
  return {
    log: () => undefined,
  }
})()
