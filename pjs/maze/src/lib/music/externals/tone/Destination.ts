import { TimeObserver } from '../../externals/tone/TimeObserver'
import { ToneOutput } from '../../externals/tone/Output'
import { MasterChannelConf } from '../../externals/tone/mixer/Master'
import { Mixer } from '../../externals/tone/mixer/Mixer'
import { PitchName } from '../../generator/constants'
import { Destination } from '../../core/Destination'
import { buildConf } from '../../utils/utils'
import { ToneInst } from './SequenceOut'

export interface ToneDestConf {
  key: PitchName
  bpm: number
  masterConf: MasterChannelConf
}

export class ToneDestination implements Destination<ToneInst> {
  readonly output: ToneOutput
  readonly mixer: Mixer
  readonly timeObserver: TimeObserver

  constructor(conf: Partial<ToneDestConf> = {}) {
    const { bpm, masterConf } = buildConf(ToneDestination.getDefault(), conf)
    this.output = new ToneOutput()
    this.mixer = new Mixer(masterConf)
    this.timeObserver = new TimeObserver(bpm)
  }

  static getDefault(): ToneDestConf {
    return {
      key: 'C',
      bpm: 120,
      masterConf: {},
    }
  }
}
