import { fireByRate } from 'utils'
import { providePreset } from '../utils/utils'
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
              if (fireByRate(options.randomRate)) return
              ch.mute('toggle')
            },
          },
        ],
      })
    }
  )
