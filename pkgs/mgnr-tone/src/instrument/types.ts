import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'

/**
 * interface to satisfy when passing through channel and outlet
 */
export type ToneInst = Pick<Instrument<InstrumentOptions>, 'triggerAttackRelease' | 'connect'>
