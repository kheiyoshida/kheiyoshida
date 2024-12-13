import { Scene } from 'maze-gl'

import { EffectParams } from '../../../domain/query'

export const getEffect = (effectParams: EffectParams): Scene['effect'] => {
  return {
    fogLevel: effectParams.fogLevel,
  }
}
