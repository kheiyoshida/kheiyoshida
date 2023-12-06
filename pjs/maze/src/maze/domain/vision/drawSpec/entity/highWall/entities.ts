import { generateFinalizer } from '../../finalize'
import {
  horizontalLineGroundExtend,
  horizontalLineGroundFront,
  proceedingLineGround,
  verticalLine,
} from '../../unit/pathEmitters'
import { stair } from '../../unit/specEmitter'
import { DrawEntityMethods, chooseParser, makeParser } from '../drawEntity'
import { generateDrawEntityGrid } from './grid'

type Side = 'edge-wall' | 'wall-vert' | 'wall-hori' | 'corner'
type Center = 'wall-hori'
type Floor = 'stair' | 'wall-hori-extend'

export type DrawEntities = Side | Center | Floor
export const DrawMethods: DrawEntityMethods<DrawEntities> = {
  'edge-wall': makeParser([
    horizontalLineGroundFront,
    proceedingLineGround,
    verticalLine,
  ]),
  corner: makeParser([verticalLine]),
  'wall-vert': makeParser([proceedingLineGround]),
  'wall-hori': makeParser([horizontalLineGroundFront]),
  'wall-hori-extend': makeParser([horizontalLineGroundExtend]),
  stair: chooseParser(stair),
}

export const finalizer = generateFinalizer(DrawMethods, generateDrawEntityGrid)
