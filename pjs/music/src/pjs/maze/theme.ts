import {
  createOutlet,
  createScaleSource,
  getMixer,
  pickRandomPitchName,
  ScaleConf,
  ScaleType,
  ToneOutlet,
} from 'mgnr-tone'
import { InstChannel } from 'mgnr-tone'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import * as instruments from './components/instruments'
import { AvailableOutlets } from './scenes'
import { makeGridFader } from '../../grid/fade.ts'

export const createDefaultTheme = () => {
  const pickScaleConfig = (): Omit<ScaleConf, 'range'> => ({
    key: pickRandomPitchName(),
    pref: randomItemFromArray<ScaleType>(['omit47', 'omit27']),
  })
  const scaleSource = createScaleSource({ ...pickScaleConfig(), range: { min: 20, max: 100 } })

  const sendTrack = getMixer({
    limitThreshold: -3,
    targetRMS: -3,
    comp: {
      threshold: -6,
      ratio: 12,
    },
  }).createSendChannel({
    effects: [
      new Tone.Filter(300, 'highpass', -48),
      new Tone.Reverb(0.1),
      new Tone.PingPongDelay('32hz', 0.3),
      new Tone.Distortion(0.02),
      new Tone.Filter(2400, 'lowpass', -24),
    ],
  })

  const mixer = getMixer()

  const synCh = mixer.createInstChannel({
    inst: instruments.thinSynth(),
    initialVolume: -40,
    volumeRange: {
      max: -6,
      min: -40,
    },
    effects: [
      new Tone.Filter(300, 'highpass', -12),
      new Tone.Filter(1400, 'highshelf', -96),
      new Tone.PingPongDelay('4n.', 0.12),
    ],
  })
  const padCh = mixer.createInstChannel({
    inst: instruments.darkPad(),
    initialVolume: -40,
    volumeRange: {
      max: -10,
      min: -40,
    },
    effects: [
      new Tone.Filter(800, 'highpass', -12),
      new Tone.Filter(840, 'notch', -24),
      new Tone.Filter(1200, 'lowshelf', -96),
      new Tone.Compressor(-20, 4),
      new Tone.Gain(4),
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
  const drumsCh = mixer.createInstChannel({
    inst: instruments.drums(),
    initialVolume: -40,
    volumeRange: {
      max: -8,
      min: -40,
    },
    effects: [new Tone.Filter(300, 'highpass'), new Tone.Filter(3000, 'lowpass', -48)],
  })

  mixer.connect(padCh, sendTrack, 0.6)
  mixer.connect(droneBassCh, sendTrack, 0.2)
  mixer.connect(synCh, sendTrack, 0.8)
  mixer.connect(drumsCh, sendTrack, 1.0)

  const channels: Record<AvailableOutlets, InstChannel> = {
    synth: synCh,
    pad: padCh,
    noise: drumsCh,
    droneBass: droneBassCh,
  }

  const outlets: Record<AvailableOutlets, ToneOutlet> = {
    synth: createOutlet(synCh.inst, Tone.Transport.toSeconds('16n')),
    pad: createOutlet(padCh.inst),
    noise: createOutlet(drumsCh.inst, Tone.Transport.toSeconds('16n')),
    droneBass: createOutlet(droneBassCh.inst, Tone.Transport.toSeconds('16n')),
  }

  const handleFade = makeGridFader(channels)

  return {
    scaleSource,
    channels,
    outlets,
    handleFade,
  }
}
