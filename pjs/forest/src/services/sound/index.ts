import { DEGREES, nthDegreeTone, pickRandomPitchName, SCALES, ScaleType } from 'mgnr-core'
import { filterDelay, reverb } from 'mgnr-tone-presets'
import * as mgnr from 'mgnr-tone/src'
import { Transport } from 'tone'
import { randomIntInclusiveBetween, randomItemFromArray } from 'utils'
import { setupExtraSynCh } from './inst/exSyn'
import { setupKick } from './inst/kick'
import { setupPadCh } from './inst/pad'
import { setupSynCh } from './inst/syn'
import { setupTom } from './inst/tom'

export type MusicCommands = ReturnType<typeof music>

export const music = () => {
  Transport.bpm.value = randomIntInclusiveBetween(96, 106)

  const key = pickRandomPitchName()
  const scale = mgnr.createScale(key, 'omit25', { min: 24, max: 48 })
  const scale2 = mgnr.createScale(key, 'omit25', { min: 48, max: 72 })

  // inst channels and generators
  const { kickCh, randomizeConfig: kickRandomize } = setupKick()
  const { tomCh, randomizeConfig: tomRandomize } = setupTom()
  const { padCh, randomizeConfig: padRandomize } = setupPadCh(scale)
  const synCh = setupSynCh(scale2)
  const { exSynCh, randomizeConfig: exSynRandomize } = setupExtraSynCh(scale2)

  // sends
  const mixer = mgnr.getMixer()
  const delayCh = mixer.createSendChannel(filterDelay())
  mixer.connect(synCh, delayCh, 1.4)
  mixer.connect(padCh, delayCh, 2)
  mixer.connect(exSynCh, delayCh, 1.4)

  const reverbCh = mixer.createSendChannel(reverb())
  mixer.connect(padCh, reverbCh, 0.5)
  mixer.connect(kickCh, reverbCh, 1)
  mixer.connect(synCh, reverbCh, 0.5)
  mixer.connect(tomCh, reverbCh, 0.5)

  const mod = () => {
    const key = nthDegreeTone(scale.key, randomItemFromArray([...DEGREES]))
    const pref = randomItemFromArray(Object.keys(SCALES).map((k) => k)) as ScaleType
    const range = { min: randomIntInclusiveBetween(45, 50), max: randomIntInclusiveBetween(51, 55) }
    scale.modulate({ key, pref, range }, 3)
    scale2.modulate({ key, pref, range }, 3)
  }

  const startMod = () => {
    mgnr.registerTimeEvents({
      once: [
        {
          time: '+0m',
          handler: mod,
        },
        {
          time: '+8m',
          handler: mod,
        },
        {
          time: '+16m',
          handler: mod,
        },
      ],
    })
  }

  return {
    startMod,

    padFadeIn: () => padCh.dynamicVolumeFade(padCh.volumeRangeDiff / 4, '2m'),
    padFadeOut: () => padCh.dynamicVolumeFade(-padCh.volumeRangeDiff / 3, '4m'),
    padRandomize,

    exSynFadeIn: () => exSynCh.dynamicVolumeFade(exSynCh.volumeRangeDiff / 4, '2m'),
    exSynFadeOut: () => exSynCh.dynamicVolumeFade(-exSynCh.volumeRangeDiff / 3, '4m'),
    exSynRandomize,

    tomFadeIn: () => tomCh.dynamicVolumeFade(tomCh.volumeRangeDiff / 4, '2m'),
    tomFadeOut: () => tomCh.dynamicVolumeFade(-tomCh.volumeRangeDiff / 3, '4m'),
    tomRandomize,

    kickFadeIn: () => kickCh.dynamicVolumeFade(kickCh.volumeRangeDiff / 4, '2m'),
    kickFadeOut: () => kickCh.dynamicVolumeFade(-kickCh.volumeRangeDiff / 3, '4m'),
    kickRandomize,
  }
}
