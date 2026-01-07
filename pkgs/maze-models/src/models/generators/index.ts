import { GeometrySpec } from '../../pipeline/types'
import { generateStackableBox } from './stackableBox'
import { generatePole } from './pole'
import { generateTile } from './tile'
import { ModelEntity } from '../entity'
import { ModelCode } from '../code'
import { GeometryGenerator } from './types'
import { generateFloatingBox } from './floatingBox'

const generators: Record<ModelCode, GeometryGenerator> = {
  FloatingBox: generateFloatingBox(false),
  FloatingFloorBox: generateFloatingBox(true),
  FloatingStairBox: generateFloatingBox(true),

  StackableBox: generateStackableBox({ stair: false }),
  StackableStairBox: generateStackableBox({ stair: true }),

  Pole1: generatePole(1),
  Pole2: generatePole(2),
  Pole3: generatePole(3),
  Pole4: generatePole(4),
  Pole5: generatePole(5),

  StairTile: generateTile(true),
  Tile: generateTile(false),
  FloorTile: generateTile(true),
}

export const generateGeometry = (modelEntity: ModelEntity): GeometrySpec => {
  return generators[modelEntity.code](modelEntity.size, modelEntity.variant)
}
