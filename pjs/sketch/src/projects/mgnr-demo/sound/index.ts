import { Scale } from 'mgnr/src/core/generator/Scale'
import { nthDegreeTone, pickRandomPitchName } from 'mgnr/src/core/generator/utils'
import * as mgnr from 'mgnr/src/mgnr-tone'
import { filterDelay, reverb } from 'src/lib/sound/presets/send/delay'
import { Transport } from 'tone'
import { setupKick, setupTom } from './inst/kick'
import { setupPadCh } from './inst/pad'
import { setupExtraSynCh, setupSynCh } from './inst/syn'

/**
 * demo song for beta release
 */
export const music = () => {
  // Transport.bpm.value = randomIntInclusiveBetween(96, 106)
  Transport.bpm.value = 120

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

  // fade
  const padFade = mgnr.makeFader(
    padCh,
    {
      volumeRange: {
        min: -52,
        max: -16,
      },
      autoFadeIn: {
        fireRate: 0.4,
        duration: '16m',
        fireInterval: '32m',
      },
      autoFadeOut: {
        fireRate: 0.4,
        duration: '8m',
        fireInterval: '32m',
      },
    },
    'on'
  )
  const exSynFade = mgnr.makeFader(
    exSynCh,
    {
      volumeRange: {
        min: -52,
        max: -20,
      },
      autoFadeIn: {
        fireRate: 0.3,
        duration: '16m',
        fireInterval: '20m',
      },
      autoFadeOut: {
        fireRate: 1,
        duration: '8m',
        fireInterval: '20m',
      },
    },
    'muted'
  )
  const kickFade = mgnr.makeFader(
    kickCh,
    {
      volumeRange: {
        min: -40,
        max: -16,
      },
      autoFadeIn: {
        fireRate: 0.3,
        duration: '16m',
        fireInterval: '16m',
      },
      autoFadeOut: {
        fireRate: 0.7,
        duration: '16m',
        fireInterval: '32m',
      },
    },
    'on'
  )
  const tomFade = mgnr.makeFader(
    tomCh,
    {
      volumeRange: {
        min: -30,
        max: -16,
      },
      autoFadeIn: {
        fireRate: 0.8,
        duration: '8m',
        fireInterval: '32m',
      },
      autoFadeOut: {
        fireRate: 0.2,
        duration: '16m',
        fireInterval: '16m',
      },
    },
    'muted'
  )

  mgnr.manageFade([tomFade, kickFade, padFade, exSynFade])

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
    padFadeIn: () => padFade.manualFadeIn('4m'),
    padFadeOut: () => padFade.manualFadeOut('8m'),
    exSynFadeIn: () => exSynFade.manualFadeIn('8m'),
    exSynFadeOut: () => exSynFade.manualFadeOut('16m'),
    tomFadeIn: () => tomFade.manualFadeIn('8m'),
    tomFadeOut: () => tomFade.manualFadeOut('12m'),
    kickFadeIn: () => kickFade.manualFadeIn('2m'),
    kickFadeOut: () => kickFade.manualFadeIn('8m'),
  }
}
