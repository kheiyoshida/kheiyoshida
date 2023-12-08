import { Musician } from 'mgnr/src/Musician'
import * as TC from 'mgnr/src/externals/tone/commands'
import * as E from 'mgnr/src/core/events'
import { Scale } from 'mgnr/src/generator/Scale'
import {
  nthDegreeTone,
  pickRandomPitchName,
} from 'mgnr/src/generator/utils'
import { random, randomIntBetween } from 'mgnr/src/utils/calc'
import { metro } from '../../debug/metro'
import { setupKick } from './inst/kick'
import { setupPadCh } from './inst/pad'
import { createFilteredDelaySend } from './mix/send'
import { setupSynCh } from './inst/syn'

/**
 * demo song for beta release
 */
export const demo = () => {
  //
  const bpm = randomIntBetween(96, 112)
  Musician.init('tone', { bpm })
  metro()

  const key = pickRandomPitchName()
  const scale = new Scale({
    key: key,
    pref: 'omit46',
    range: {
      min: 30,
      max: 50,
    },
  })

  const scale2 = new Scale({
    key: key,
    pref: 'omit25',
    range: {
      min: 45,
      max: 65,
    },
  })

  const delaySend = createFilteredDelaySend()

  setupKick(delaySend)

  setupSynCh(scale2, delaySend)

  setupPadCh(scale, delaySend)

  TC.RegisterTimeEvents.pub({
    events: {
      repeat: [
        {
          start: '16:0:0',
          interval: '16m',
          handler: () => {
            if (random(0.2)) return
            const key = nthDegreeTone(scale.key, '6')
            E.ScaleModulationRequired.pub({
              scale,
              next: {
                key,
              },
              stages: 4,
            })
            E.ScaleModulationRequired.pub({
              scale: scale2,
              next: {
                key,
              },
              stages: 4,
            })
          },
        },
      ],
    },
  })
}
