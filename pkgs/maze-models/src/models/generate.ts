import { GeometrySpec } from '../pipeline/types'
import { generateFloatingBox, generateStackableBox } from './generators/box'
import { generatePole } from './generators/pole'
import { generateTile } from './generators/tile'
import { ModelEntity } from './entity'
import { ModelCode } from './code'
import { GeometryGenerator } from './generators/types'

const generators: Record<ModelCode, GeometryGenerator> = {
  // TODO: use different algorithm for stair
  FloatingBox: generateFloatingBox,
  FloatingFloorBox: generateFloatingBox,
  FloatingStairBox: generateFloatingBox,

  StackableBox: generateStackableBox({ stair: false }),
  StackableStairBox: generateStackableBox({ stair: true }),

  Pole1: generatePole(1),
  Pole2: generatePole(2),
  Pole3: generatePole(3),
  Pole4: generatePole(4),
  Pole5: generatePole(5),

  StairTile: generateTile,
  BottomTile: generateTile,
  Tile: generateTile,
}

export const generateGeometry = (modelEntity: ModelEntity): GeometrySpec => {
  return generators[modelEntity.code](modelEntity.size, modelEntity.variant)
}
