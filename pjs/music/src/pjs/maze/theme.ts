import { createOutlet, createScaleSource, getMixer, pickRandomPitchName } from 'mgnr-tone'
import { ToneOutlet } from 'mgnr-tone/src/Outlet'
import { InstChannel } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import * as instruments from './components/instruments'
import { AvailableOutlets } from './scenes'
import { makeFader } from 'mgnr-tone/src/theme/fade'
import { ScaleConf } from '../../../../../pkgs/mgnr-core/src/generator/scale/Scale'
import { ScaleType } from '../../../../../pkgs/mgnr-core/src/generator/constants'

export const createDefaultTheme = () => {
  const pickScaleConfig = (): Omit<ScaleConf, 'range'> => ({
    key: pickRandomPitchName(),
    pref: randomItemFromArray<ScaleType>(['omit25', 'major']),
  })
  const scaleSource = createScaleSource({ ...pickScaleConfig(), range: { min: 20, max: 100 } })

  const sendTrack = getMixer().createSendChannel({
    effects: [
      new Tone.Filter(500, 'lowshelf'),
      new Tone.Filter(670, 'notch'),
      new Tone.Filter(3000, 'lowpass'),
      new Tone.Compressor(-6, 8),
    ],
  })

  const mixer = getMixer()

  const synCh = mixer.createInstChannel({
    inst: instruments.thinSynth(),
    initialVolume: -40,
    volumeRange: {
      max: -10,
      min: -40,
    },
    effects: [new Tone.Filter(300, 'highpass'), new Tone.Filter(1000, 'highshelf')],
  })
  const padCh = mixer.createInstChannel({
    inst: instruments.darkPad(),
    initialVolume: -40,
    volumeRange: {
      max: -10,
      min: -40,
    },
    effects: [
      new Tone.Filter(300, 'highpass'),
      new Tone.Filter(800, 'notch'),
      new Tone.Filter(1000, 'highshelf'),
    ],
  })

  const droneBassCh = mixer.createInstChannel({
    inst: instruments.droneBass(),
    initialVolume: -40,
    volumeRange: {
      max: -12,
      min: -40,
    },
    effects: [new Tone.Filter(50, 'highpass')],
  })
  const noiseCh = mixer.createInstChannel({
    inst: instruments.noise(),
    initialVolume: -40,
    volumeRange: {
      max: -12,
      min: -40,
    },
    effects: [
      new Tone.Filter(300, 'highpass'),
      new Tone.Filter(1000, 'lowpass'),
    ],
  })

  mixer.connect(padCh, sendTrack, 1.2)
  mixer.connect(droneBassCh, sendTrack, 0.2)
  mixer.connect(synCh, sendTrack, 0.8)

  const channels: Record<AvailableOutlets, InstChannel> = {
    synth: synCh,
    pad: padCh,
    noise: noiseCh,
    droneBass: droneBassCh,
  }

  const outlets: Record<AvailableOutlets, ToneOutlet> = {
    synth: createOutlet(synCh.inst, Tone.Transport.toSeconds('16n')),
    pad: createOutlet(padCh.inst),
    noise: createOutlet(noiseCh.inst, Tone.Transport.toSeconds('16n')),
    droneBass: createOutlet(droneBassCh.inst, Tone.Transport.toSeconds('16n')),
  }

  const handlefade = makeFader(channels)

  return {
    scaleSource,
    channels,
    outlets,
    handlefade,
  }
}
