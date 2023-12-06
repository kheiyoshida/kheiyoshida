import { RegisterTimeEvents } from "mgnr/dist/externals/tone/commands"
import { Transport } from "tone"

export const metro = (interval = '1m') => {
  RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          interval,
          handler: () => {
            console.debug(Transport.position)
          },
        },
      ],
    },
  })
}