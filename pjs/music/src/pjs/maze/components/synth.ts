import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { createScaleRange } from './utils/scale'
import { convertRandomLevel } from './utils/randomness'

export const synth =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    return {
      outId: 'synth',
      generators: [],
    }
  }
