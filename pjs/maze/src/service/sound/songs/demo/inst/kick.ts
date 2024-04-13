import * as mgnr from 'mgnr-tone/src'
import { InstChConf } from 'mgnr-tone/src/mixer/Channel'
import { kickFactory } from '../../../notes/kick'
import * as Tone from 'tone'
import { fireByRate } from 'utils'

const createKickCh = () => {
  const kickCh: InstChConf = {
    id: 'kick',
    inst: new Tone.MembraneSynth(),
    effects: [
      new Tone.Filter({ frequency: 100, type: 'highpass' }),
      new Tone.Filter({ frequency: 200, type: 'lowpass' }),
      new Tone.Compressor(-10, 1.5).set({ attack: 0.8, release: 0.1 }),
    ],
    initialVolume: -40,
    volumeRange: {
      max: -16,
      min: -40,
    },
  }
  return kickCh
}

export const setupKick = () => {
  const mixer = mgnr.getMixer()
  const kickCh = mixer.createInstChannel(createKickCh())
  const kickOut = mgnr.createOutlet(kickCh)
  const generator = mgnr.createGenerator({
    scale: mgnr.createScale({ range: { min: 30, max: 31 } }),
    length: 32,
    division: 8,
    density: 0.55,
    fillStrategy: 'fill',
    fillPref: 'mono',
  })
  const kickTemplate = kickFactory(32, 8)
  generator.constructNotes(kickTemplate)
  generator.feedOutlet(kickOut)
  kickOut.loopSequence(2).onEnded(({ repeatLoop }) => {
    generator.resetNotes(kickTemplate)
    repeatLoop()
  })
  kickCh.mute('on')
  mgnr.registerTimeEvents({
    repeat: [
      {
        interval: '32m',
        handler: () => {
          if (fireByRate(0.3)) {
            kickCh.dynamicVolumeFade(kickCh.volumeRangeDiff, '16m')
          }
          if (fireByRate(0.3)) {
            kickCh.dynamicVolumeFade(-kickCh.volumeRangeDiff, '8m')
          }
        },
      },
    ],
  })
  return kickCh
}
