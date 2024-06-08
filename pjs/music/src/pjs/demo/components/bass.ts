import {
  ThemeComponentMaker,
  createGenerator,
  createOutlet,
  getMixer,
  injectFadeInOut,
  pingpongSequenceLength,
} from 'mgnr-tone'
import * as Tone from 'tone'
import * as instruments from './instruments'

const mixer = getMixer()

export const prepareWonderBassTrack: ThemeComponentMaker = (startAt, source) => {
  const pad = instruments.wonderBass()
  const channel = mixer.createInstChannel({
    inst: pad,
    initialVolume: -20,
    volumeRange: {
      max: -6,
      min: -40,
    },
  })
  const outlet = createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  const scale = source.createScale({ range: { min: 20, max: 45 } })
  const generator = createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 4,
      },
    },
  })
  const port = outlet.assignGenerator(generator).loopSequence(4, startAt)

  const generator2 = createGenerator({
    scale,
    sequence: {
      division: 4,
      length: 12,
      density: 0.3,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
    middlewares: {
      lengthChange: pingpongSequenceLength('extend'),
    },
  })
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(4, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
    .onEnded((g) => g.resetNotes())

  return {
    ...injectFadeInOut(channel, [port, port2]),
    playLess() {},
    playMore() {},
  }
}
