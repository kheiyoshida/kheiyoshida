import { isClassic, isFloatingBox, isPole, isStackableBox, isTile, ModelCode } from './code'
import { GeometrySpec } from '../pipeline/types'
import { getBaseGeometry } from './base'
import { generateClassicModel } from './generators/classic'
import { defaultModifier, ModifierParams } from './modifiers'
import { randomIntInclusiveBetween } from 'utils'
import { generateTileGeometry } from './generators/tile'
import { runPipeline } from '../pipeline/pipeline'
import { computeVertexNormals, recomputeFaceNormals } from '../pipeline/processors/normals'
import { generatePoleGeometry } from './generators/pole'
import { generateFloatingBox, generateStackableBox } from './generators/box'

export type { ModelCode } from './code'

export const generateGeometry = (modelCode: ModelCode): GeometrySpec => {
  if (isClassic(modelCode)) return generateClassicModel(modelCode)

  if (isFloatingBox(modelCode)) {
    return generateFloatingBox(getBaseGeometry(modelCode), {
      tesselation: 3,
      sizeRange: [0.8, 0.9],
      computeNormals: undefined,
      distortion: 0.1,
    })
  }

  if (isStackableBox(modelCode))
    return generateStackableBox(getBaseGeometry(modelCode), {
      tesselation: 3,
      sizeRange: [0.5, 1.0],
      computeNormals: undefined,
      distortion: 0.1,
    })

  if (isPole(modelCode)) {
    const pole = generatePoleGeometry({
      type: 'pole',
      radiusBase: 1,
      radiusDelta: 0.8,
      numOfCorners: 8,
      heightBase: 8,
      heightDelta: 4,
      heightPerSegment: 0.5,
      segmentYDelta: 0.3,
    })
    return runPipeline(pole, [recomputeFaceNormals, computeVertexNormals])
  }

  if (isTile(modelCode)) {
    const tile = generateTileGeometry({
      numOfCorners: 20,
      radiusBase: 0.8,
      radiusDelta: 0.7,
      thicknessBase: 1.5,
      thicknessDelta: 1.0,
    })
    return runPipeline(tile, [recomputeFaceNormals, computeVertexNormals])
  }

  const base = getBaseGeometry(modelCode)
  const params: ModifierParams = {
    tesselation: randomIntInclusiveBetween(1, 2),
    deform: (v) => [
      v[0] + (Math.random() - 0.5) * 0.1,
      v[1] + (Math.random() - 0.5) * 0.1,
      v[2] + (Math.random() - 0.5) * 0.1,
    ],
    computeNormals: 'vertex',
  }
  return defaultModifier(params)(base)
  // return BaseGeometryMap[modelCode]
}
