import { PolySynth } from 'tone'
import { Generator } from '../generator/Generator'
import { Inst, Mixer } from '../externals/tone/mixer/Mixer'
import { InstChannel } from '../externals/tone/mixer/Channel'

export const createGenerator = (): Generator => {
  const generator = new Generator({
    conf: {},
    notes: {
      1: [
        {
          pitch: 'random',
          vel: 100,
          dur: 1
        }
      ]
    }
  })
  return generator
}

export const createInstrument = ():Inst => {
  return new PolySynth()
}

export const createMixer = ():Mixer => {
  return new Mixer({})
}

export const createInstChannel = (inst: Inst):InstChannel => {
  return new InstChannel({inst})
}

export const assignGeneratorToChannel = () => {}
