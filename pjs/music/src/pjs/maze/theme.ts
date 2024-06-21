import { createOutlet, createScaleSource, getMixer, pickRandomPitchName } from 'mgnr-tone'
import { ToneOutlet } from 'mgnr-tone/src/Outlet'
import { InstChannel } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import * as instruments from './components/instruments'
import { AvailableOutlets } from './scenes'
import { makeFader } from 'mgnr-tone/src/theme/fade'

export const createDefaultTheme = () => {
  const scaleSource = createScaleSource({
    key: pickRandomPitchName(),
    range: { min: 20, max: 100 },
    pref: randomItemFromArray(['omit25', 'omit27', 'omit47']),
  })

  const sendTrack = getMixer().createSendChannel({
    effects: [
      new Tone.PingPongDelay('8n.', 0.1),
      new Tone.Reverb(0.5),
      new Tone.Filter(8000, 'lowpass'),
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
    effects: [new Tone.Filter(1000, 'highpass')],
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
  mixer.connect(droneBassCh, sendTrack, 0.2)

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
