import { fireByRate } from 'utils'
import { providePreset } from '../utils'
import { Channel } from 'mgnr-tone'
import { registerTimeEvents as registerEvents } from 'mgnr-tone'

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
