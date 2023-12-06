import {
  TONE_COMMAND_HANDLERS,
  TONE_EVENT_HANDLERS,
} from './externals/tone/handlers'
import { MessageBus } from './core/MessageBus'
import { ToneDestConf, ToneDestination } from './externals/tone/Destination'

export type Platform = 'tone'

export abstract class Musician {
  static init(platform: Platform = 'tone', initialConf?: Partial<ToneDestConf>) {
    if (platform === 'tone') {
      ToneMusician.init(initialConf)
    } else {
      throw Error(`Not implemented`)
    }
  }
}

class ToneMusician {
  static init(initialConf?: Partial<ToneDestConf>) {
    MessageBus.init(
      new ToneDestination(initialConf),
      TONE_EVENT_HANDLERS,
      TONE_COMMAND_HANDLERS
    )
  }
}
