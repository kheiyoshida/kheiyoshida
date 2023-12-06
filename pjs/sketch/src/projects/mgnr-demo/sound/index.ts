import { Musician } from 'mgnr/dist/Musician'
import * as E from 'mgnr/dist/core/events'
import * as TC from 'mgnr/dist/externals/tone/commands'
import { Scale } from 'mgnr/dist/generator/Scale'
import { nthDegreeTone, pickRandomPitchName } from 'mgnr/dist/generator/utils'
import { randomIntBetween } from 'mgnr/dist/utils/calc'
import { makeFader } from 'src/lib/sound/presets/mix/fade'
import { manageFade } from 'src/lib/sound/presets/mix/fadeManager'
import { filterDelay, reverb } from 'src/lib/sound/presets/send/delay'
import { metro } from 'src/lib/sound/utils/debug'
import { setupKick, setupTom } from './inst/kick'
import { setupPadCh } from './inst/pad'
import { setupExtraSynCh, setupSynCh } from './inst/syn'

/**
 * demo song for beta release
 */
export const music = () => {
  // initialize
  const bpm = randomIntBetween(96, 106)
  Musician.init('tone', { bpm })
  metro()

  // scale
  const key = pickRandomPitchName()
  const scale = new Scale({
    key: key,
    pref: 'omit25',
    range: {
      min: 24,
      max: 48,
    },
  })

  const scale2 = new Scale({
    key: key,
    pref: 'omit25',
    range: {
      min: 48,
      max: 72,
    },
  })

  // inst channels and generators
  const kickCh = setupKick()
  const tomCh = setupTom()
  const padCh = setupPadCh(scale)
  const synCh = setupSynCh(scale2)
  const exSynCh = setupExtraSynCh(scale2)

  // sends
  const delaySend = filterDelay()
  TC.SetupSendChannel.pub({ conf: delaySend })
  TC.AssignSendChannel.pub({
    from: synCh.id,
    to: delaySend.id,
    gainAmount: 1.4,
  })
  TC.AssignSendChannel.pub({
    from: padCh.id,
    to: delaySend.id,
    gainAmount: 2,
  })
  TC.AssignSendChannel.pub({
    from: exSynCh.id,
    to: delaySend.id,
    gainAmount: 1.4,
  })

  const reverbSend = reverb()
  TC.SetupSendChannel.pub({ conf: reverbSend })
  TC.AssignSendChannel.pub({
    from: kickCh.id,
    to: reverbSend.id,
    gainAmount: 1,
  })
  TC.AssignSendChannel.pub({
    from: synCh.id,
    to: reverbSend.id,
    gainAmount: 0.5,
  })
  TC.AssignSendChannel.pub({
    from: tomCh.id,
    to: reverbSend.id,
    gainAmount: 0.5,
  })

  // fade
  const padFade = makeFader(
    padCh.id,
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
  const exSynFade = makeFader(
    exSynCh.id,
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
  const kickFade = makeFader(
    kickCh.id,
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
  const tomFade = makeFader(
    tomCh.id,
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

  manageFade([tomFade, kickFade, padFade, exSynFade])

  const startMod = () => {
    TC.RegisterTimeEvents.pub({
      events: {
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
      },
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

const mod = (scale: Scale, scale2: Scale) => {
  const key = nthDegreeTone(scale.key, '6')
  E.ScaleModulationRequired.pub({
    scale,
    next: {
      key,
    },
    stages: 3,
  })
  E.ScaleModulationRequired.pub({
    scale: scale2,
    next: {
      key,
    },
    stages: 3,
  })
}
