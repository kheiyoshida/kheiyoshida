import { BlurParams } from './blur/model'
import { EdgeRenderingParams } from './edge/model'
import { DistortionParams } from './distortion/model'
import { FogParams } from './fog/model'
import { FadeParams } from './fade/model'

export type EffectParams = {
  time: number
  resolution: [number, number]
  edge?: EdgeRenderingParams
  fog?: FogParams
  blur?: BlurParams
  distortion?: DistortionParams
  fade?: FadeParams
}
