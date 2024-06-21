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
    key: 'C',
    // key: pickRandomPitchName(),
    pref: randomItemFromArray<ScaleType>(['omit25']),
  })
  const scaleSource = createScaleSource({ ...pickScaleConfig(), range: { min: 20, max: 100 } })

  const sendTrack = getMixer().createSendChannel({
    effects: [
      new Tone.PingPongDelay('8n.', 0.2),
      new Tone.Reverb(0.3),
      new Tone.Filter(400, 'lowshelf'),
      new Tone.Filter(800, 'notch'),
      new Tone.Filter(2000, 'lowpass'),
    ],
  })

  const mixer = getMixer()

  const padCh = mixer.createInstChannel({
    inst: instruments.darkPad(),
    initialVolume: -40,
    volumeRange: {
      max: -10,
      min: -40,
    },
    effects: [new Tone.Filter(300, 'highpass'), new Tone.Filter(1000, 'highshelf')],
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
    effects: [new Tone.Filter(1000, 'highpass')],
  })

  mixer.connect(padCh, sendTrack, 1.2)
  // mixer.connect(droneBassCh, sendTrack, 0.2)

  const channels: Record<AvailableOutlets, InstChannel> = {
    pad: padCh,
    noise: noiseCh,
    droneBass: droneBassCh,
  }

  const outlets: Record<AvailableOutlets, ToneOutlet> = {
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
