import { Shader } from 'maze-gl'
import vert from './default.vert?raw'
import frag from './default.frag?raw'

export const defaultShader = new Shader(vert, frag)
