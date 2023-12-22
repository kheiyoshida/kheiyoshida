import { filterDelay, reverb } from 'mgnr-tone-presets'
import { Scale } from 'mgnr/src/core/generator/Scale'
import { nthDegreeTone, pickRandomPitchName } from 'mgnr/src/core/generator/utils'
import * as mgnr from 'mgnr/src/mgnr-tone'
import { Transport } from 'tone'
import { randomIntInclusiveBetween } from 'utils'
import { setupExtraSynCh } from './inst/exSyn'
import { setupKick } from './inst/kick'
import { setupPadCh } from './inst/pad'
import { setupSynCh } from './inst/syn'
import { setupTom } from './inst/tom'

/**
 * demo song for beta release
 */
export const music = () => {
  Transport.bpm.value = randomIntInclusiveBetween(96, 106)

  const key = pickRandomPitchName()
  const scale = mgnr.createScale(key, 'omit25', { min: 24, max: 48 })
  const scale2 = mgnr.createScale(key, 'omit25', { min: 48, max: 72 })

  // inst channels and generators
  const kickCh = setupKick()
  const tomCh = setupTom()
  const padCh = setupPadCh(scale)
  const synCh = setupSynCh(scale2)
  const exSynCh = setupExtraSynCh(scale2)

  // sends
  const mixer = mgnr.getMixer()
  const delayCh = mixer.createSendChannel(filterDelay())
  mixer.connect(synCh, delayCh, 1.4)
  mixer.connect(padCh, delayCh, 2)
  mixer.connect(exSynCh, delayCh, 1.4)

  const reverbCh = mixer.createSendChannel(reverb())
  mixer.connect(kickCh, reverbCh, 1)
  mixer.connect(synCh, reverbCh, 0.5)
  mixer.connect(tomCh, reverbCh, 0.5)

  const mod = (scale: Scale, scale2: Scale) => {
    const key = nthDegreeTone(scale.key, '6')
    scale.modulate({ key }, 3)
    scale2.modulate({ key }, 3)
  }

  const startMod = () => {
    mgnr.registerTimeEvents({
      once: [
        {
          time: '+0m',
          handler: () => {
            mod(scale, scale2)
          },
        },
        {
          time: '+8m',
          handler: () => {
            mod(scale, scale2)
          },
        },
        {
          time: '+16m',
          handler: () => {
            mod(scale, scale2)
          },
        },
      ],
    })
  }

  return {
    startMod,
    padFadeIn: () => padCh.dynamicVolumeFade(8, '2m'),
    padFadeOut: () => padCh.dynamicVolumeFade(-8, '2m'),
    exSynFadeIn: () => {
      exSynCh.dynamicVolumeFade(8, '2m')
    },
    exSynFadeOut: () => exSynCh.dynamicVolumeFade(-8, '2m'),
    tomFadeIn: () => tomCh.dynamicVolumeFade(6, '2m'),
    tomFadeOut: () => tomCh.dynamicVolumeFade(-6, '2m'),
    kickFadeIn: () => kickCh.dynamicVolumeFade(2, '2m'),
    kickFadeOut: () => kickCh.dynamicVolumeFade(-2, '2m'),
    debug: () => {},
  }
}
