import { Fader } from './fade'
import * as TC from 'mgnr/src/externals/tone/commands'

const detectSilence = (fadeList: Fader[]): boolean =>
  fadeList.every((fade) => fade.fadeState.value === 'muted')

export const manageFade = (fadeList: Fader[]) => {
  TC.RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          interval: '4m',
          handler: () => {
            if (detectSilence(fadeList)) {
              fadeList[0].manualFadeIn('4m')
            }
          },
        },
      ],
    },
  })
}
