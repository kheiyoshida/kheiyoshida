import Logger from "js-logger"
import { RegisterTimeEvents } from "mgnr/src//externals/tone/commands"
import { Transport } from "tone"

export const metro = (interval = '1m') => {
  RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          interval,
          handler: () => {
            Logger.info(Transport.position)
          },
        },
      ],
    },
  })
}