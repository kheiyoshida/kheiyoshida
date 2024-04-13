import Logger from 'js-logger'
import { registerTimeEvents } from 'mgnr-tone/src'
import { Transport } from 'tone'

export const metro = (interval = '1m') => {
  registerTimeEvents({
    repeat: [
      {
        interval,
        handler: () => {
          Logger.info(Transport.position)
        },
      },
    ],
  })
}
