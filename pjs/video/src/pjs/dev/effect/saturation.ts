import { PostEffect } from '../../../lib/effect/effect'
import vert from './saturation.vert?raw'
import frag from './saturation.frag?raw'

export const saturationEffectFactory = PostEffect.makeFactory(vert, frag)
