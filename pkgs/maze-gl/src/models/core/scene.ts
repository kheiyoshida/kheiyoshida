import { RenderUnit } from './unit/unit'
import { Color } from '../supporting/color'
import { Eye } from './eye'
import { EffectParams } from './effect'

export type Scene = {
  eye: Eye
  units: RenderUnit[]
  baseColor: Color
  effect: EffectParams
}

