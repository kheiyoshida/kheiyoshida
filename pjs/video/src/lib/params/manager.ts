import { IFaderParamsControlAdapter, IKnobParamsControlAdapter, NoOpFaderParamsAdapter, NoOpKnobParamsAdapter } from './adapter'
import { FaderParamsBuffer, KnobParamsBuffer } from './buffer'

type AdapterSpec = {
  knob: IKnobParamsControlAdapter[]
  fader: IFaderParamsControlAdapter
}

export class ParamsManager {
  constructor(spec: Partial<AdapterSpec>) {
    spec.knob ??= []
    for (let i = 0; i < 8; i++) {
      this.params[i] = new KnobParamsBuffer(spec.knob[i] || NoOpKnobParamsAdapter, `params ${i + 1}`)
    }
    this.fader = new FaderParamsBuffer(spec.fader || NoOpFaderParamsAdapter)
  }

  params: KnobParamsBuffer[] = []
  fader: FaderParamsBuffer

  apply() {
    for (let i = 0; i < 8; i++) {
      this.params[i].apply()
    }
    this.fader.apply()
  }
}
