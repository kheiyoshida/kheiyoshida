import * as TC from 'mgnr/src/externals/tone/commands'
import * as TE from 'mgnr/src/externals/tone/events'
import { random } from 'src/lib/utils/random'
import { providePreset } from '../utils'

export const registerTremolo = (chId: string) =>
  providePreset(
    {
      interval: '72hz',
      randomRate: 0.3,
    },
    (options) => {
      TC.RegisterTimeEvents.pub({
        events: {
          repeat: [
            {
              interval: options.interval,
              handler: () => {
                if (random(options.randomRate)) return
                TE.MuteRequired.pub({
                  channel: chId,
                  value: 'toggle',
                })
              },
            },
          ],
        },
      })
    }
  )
