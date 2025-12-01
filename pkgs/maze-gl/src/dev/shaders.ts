import vert from '../../../../pjs/maze/src/service/render/object/material/shaders/default.vert?raw'
import litFogFrag from '../../../../pjs/maze/src/service/render/object/material/shaders/default.frag?raw'
import unlitFogFrag from '../../../../pjs/maze/src/service/render/object/material/shaders/unlitFog.frag?raw'
import edgeRenderingFrag from '../../../../pjs/maze/src/service/render/object/material/shaders/edgeRendering.frag?raw'
import { MaterialShader, Shader } from '../models'

export const litFog = new MaterialShader(vert, litFogFrag)
export const unlitFog = new MaterialShader(vert, unlitFogFrag)
export const edgeRendering = new MaterialShader(vert, edgeRenderingFrag)

