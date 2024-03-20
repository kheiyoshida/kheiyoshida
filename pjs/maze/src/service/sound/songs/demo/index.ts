import { Scale } from 'mgnr-core/src'
import { nthDegreeTone, pickRandomPitchName } from 'mgnr-core/src/generator/utils'
import * as mgnr from 'mgnr-tone/src'
import { registerTimeEvents } from 'mgnr-tone/src'
import { Transport } from 'tone'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { metro } from '../../debug/metro'
import { setupKick } from './inst/kick'
import { setupPadCh } from './inst/pad'
import { setupSynCh } from './inst/syn'
import { createFilteredDelaySend } from './mix/send'

/**
 * demo song for beta release
 */
export const demo = () => {
  Transport.bpm.value = randomIntInclusiveBetween(96, 112)
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

  const mixer = mgnr.getMixer()
  const delaySend = mixer.createSendChannel(createFilteredDelaySend())

  const kickCh = setupKick()
  mixer.connect(kickCh, delaySend)

  const padCh = setupPadCh(scale, )
  mixer.connect(padCh, delaySend, 2)

  const synCh = setupSynCh(scale2)
  mixer.connect(synCh, delaySend, 1.4)

  registerTimeEvents({
    repeat: [
      {
        start: '16:0:0',
        interval: '16m',
        handler: () => {
          if (fireByRate(0.2)) return
          const key = nthDegreeTone(scale.key, '6')
          scale.modulate({ key }, 4)
          scale2.modulate({ key }, 4)
        },
      },
    ],
  })
}
