import { Scene } from 'maze-gl'

import { EffectParams } from '../../../integration/query'

export const getEffect = (effectParams: EffectParams): Scene['effect'] => {
  return {
    fogLevel: effectParams.fogLevel,
  }
}
