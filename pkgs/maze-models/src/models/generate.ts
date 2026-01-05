import { GeometrySpec } from '../pipeline/types'
import { isClassic, isFloatingBox, isPole, isStackableBox, isTile, ModelCode } from './code'
import { generateClassicModel } from './generators/classic'
import { generateFloatingBox, generateStackableBox } from './generators/box'
import { generatePole } from './generators/pole'
import { generateTile } from './generators/tile'
import { getBaseGeometry } from './factory'

export const generateGeometry = (modelCode: ModelCode): GeometrySpec => {
  if (isClassic(modelCode))
    return generateClassicModel(modelCode, {
      tesselation: 2,
      normalComputeType: 'preserve',
    })

  if (isFloatingBox(modelCode))
    return generateFloatingBox(modelCode, {
      tesselation: 3,
      sizeRange: [0.8, 0.9],
      normalComputeType: undefined,
      distortion: 0.1,
    })

  if (isStackableBox(modelCode))
    return generateStackableBox(modelCode, {
      tesselation: 3,
      sizeRange: [0.5, 1.0],
      normalComputeType: undefined,
      distortion: 0.1,
    })

  if (isPole(modelCode)) {

    return generatePole(modelCode, {
      type: 'pole',
      radiusBase: 0.6,
      radiusDelta: 0.8,
      numOfCorners: 8,
      heightBase: 2, // will be overridden
      heightDelta: 0,
      heightPerSegment: 0.5,
      segmentYDelta: 0.3,
      normalComputeType: 'preserve',
      distortion: 0,
    })
  }

  if (isTile(modelCode)) {
    return generateTile(modelCode, {
      numOfCorners: 20,
      radiusBase: 0.8,
      radiusDelta: 0.7,
      thicknessBase: 1.5,
      thicknessDelta: 1.0,
      distortion: 0,
      tesselation: 0,
      normalComputeType: 'preserve',
    })
  }

  return getBaseGeometry(modelCode)
}
