import * as Tone from 'tone'
import * as Commands from 'src/lib/music/externals/tone/commands'
import {
  ChConf,
  InstCh,
} from 'src/lib/music/externals/tone/mixer/Channel'

export const createSynCh = () => {
  const synCh: ChConf<InstCh> = {
    id: 'syn1',
    inst: new Tone.PolySynth().set({envelope: {attack: 0.02, sustain: 0.8,release: 0.2}}),
    effects: [
      new Tone.Filter(600, 'highpass'),
      new Tone.Filter(5000, 'lowpass'),
    ],
    initialVolume: -30,
  }
  Commands.SetupInstChannel.pub({conf: synCh})
  return synCh
}

export const createPadCh = () => {
  const padCh: ChConf<InstCh> = {
    id: 'pad',
    inst: new Tone.PolySynth().set({
      envelope: { attack: 0.4, sustain: 0.2, release: 0.8 },
    }),
    effects: [
      new Tone.Filter(200, 'highpass'),
      new Tone.Filter(4000, 'lowpass'),
      new Tone.Compressor({ attack: 0.2, release: 0.7, threshold: -30 }),
    ],
    initialVolume: -15
  }
  Commands.SetupInstChannel.pub({conf: padCh})
  return padCh
}

export const createKickCh = () => {
  const kickCh: ChConf<InstCh> = {
    id: 'kick',
    inst: new Tone.MembraneSynth(),
    effects: [new Tone.Filter({ frequency: 200 })],
    initialVolume: -20
  }
  Commands.SetupInstChannel.pub({conf: kickCh})
  return kickCh
}

