import vert from './saturation.vert?raw'
import frag from './saturation.frag?raw'
import { Shader } from '../../../gl/shader'

export const saturationFxShader = () => new Shader(vert, frag)
