import { random } from 'src/lib/utils/random'
import { providePreset } from '../utils'
import { Channel } from 'mgnr/src/mgnr-tone/mixer/Channel'
import { registerEvents } from 'mgnr/src/mgnr-tone/timeEvent'

export const registerTremolo = (ch: Channel) =>
  providePreset(
    {
      interval: '72hz',
      randomRate: 0.3,
    },
    (options) => {
      registerEvents({
        repeat: [
          {
            interval: options.interval,
            handler: () => {
              if (random(options.randomRate)) return
              ch.mute('toggle')
            },
          },
        ],
      })
    }
  )
