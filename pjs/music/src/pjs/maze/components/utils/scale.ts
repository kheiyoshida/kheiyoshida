import { Range } from 'utils'

const OCTAVE = 12

export const createScaleRange = (center: number, octave: number = 1): Range =>  {
  if (octave < 1) 
    throw Error(`scale must ensure at least 12 pitches range`)
  const pitches = octave * OCTAVE
  const half = Math.floor(pitches / 2)
  return {
    max: center + half,
    min: center - half
  } 
}
