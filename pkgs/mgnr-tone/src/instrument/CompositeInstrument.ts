import { InputNode } from 'tone'
import { Frequency, Time } from 'tone/build/esm/core/type/Units'
import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import { ToneInst } from '../types'

export class CompositeInstrument implements ToneInst {
  private instruments: ToneInst[]
  constructor(...instruments: ToneInst[]) {
    this.instruments = instruments
  }
  
  triggerAttackRelease(
    note: Frequency,
    duration: Time,
    time?: Time | undefined,
    velocity?: number | undefined
  ): Instrument<InstrumentOptions> {
    this.instruments.forEach((instrument) => instrument.triggerAttackRelease(note, duration, time, velocity))
    return this.instruments[0] as Instrument<InstrumentOptions> //
  }
  connect(destination: InputNode): Instrument<InstrumentOptions> {
    this.instruments.forEach((instrument) => instrument.connect(destination))
    return this.instruments[0] as Instrument<InstrumentOptions> //
  }
}
