import { createOutlet, createScaleSource, getMixer, pickRandomPitchName, ToneOutlet } from 'mgnr-tone'
import { InstChannel } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import * as instruments from './components/instruments'
import { AvailableOutlets } from './scenes'
import { makeGridFader } from '../../grid/fade.ts'

export const createDefaultTheme = () => {
  const scaleSource = createScaleSource({
    key: pickRandomPitchName(),
    range: { min: 20, max: 100 },
    pref: randomItemFromArray(['omit25', 'omit27', 'omit47']),
  })

  const sendTrack = getMixer().createSendChannel({
    effects: [new Tone.PingPongDelay('8n.', 0.1), new Tone.Reverb(0.5), new Tone.Filter(8000, 'lowpass')],
  })

  const mixer = getMixer()

  const synCh = mixer.createInstChannel({
    inst: instruments.darkLead(),
    effects: [new Tone.Filter(300, 'highpass'), new Tone.Filter(10000, 'lowpass')],
    initialVolume: -40,
    volumeRange: {
      max: -18,
      min: -40,
    },
  })
  const padCh = mixer.createInstChannel({
    inst: instruments.darkPad(),
    initialVolume: -40,
    volumeRange: {
      max: -10,
      min: -40,
    },
    effects: [new Tone.Filter(500, 'highpass')],
  })
  const bassCh = mixer.createInstChannel({
    inst: instruments.darkBass(),
    initialVolume: -40,
    volumeRange: {
      max: -12,
      min: -40,
    },
    effects: [new Tone.Filter(50, 'highpass')],
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
    inst: instruments.beatDrums(),
    initialVolume: -40,
    volumeRange: {
      max: -12,
      min: -40,
    },
    effects: [new Tone.Filter(120, 'highpass'), new Tone.Filter(10000, 'lowpass')],
  })

  mixer.connect(synCh, sendTrack, 0.8)
  mixer.connect(padCh, sendTrack, 1.2)
  mixer.connect(drumsCh, sendTrack, 0.2)
  mixer.connect(droneBassCh, sendTrack, 0.2)

  const channels: Record<AvailableOutlets, InstChannel> = {
    synth: synCh,
    pad: padCh,
    drums: drumsCh,
    bass: bassCh,
    droneBass: droneBassCh,
  }

  const outlets: Record<AvailableOutlets, ToneOutlet> = {
    synth: createOutlet(synCh.inst, Tone.Transport.toSeconds('16n')),
    pad: createOutlet(padCh.inst),
    drums: createOutlet(drumsCh.inst, Tone.Transport.toSeconds('16n')),
    bass: createOutlet(bassCh.inst, Tone.Transport.toSeconds('16n')),
    droneBass: createOutlet(droneBassCh.inst, Tone.Transport.toSeconds('16n')),
  }

  const handlefade = makeGridFader(channels)

  return {
    scaleSource,
    channels,
    outlets,
    handlefade,
  }
}
