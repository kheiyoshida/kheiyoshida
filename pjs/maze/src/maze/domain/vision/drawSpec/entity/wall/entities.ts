import { generateFinalizer } from '../../finalize'
import {
  doubleHorizontalLine,
  doubleProceedingLine,
} from '../../unit/collections'
import {
  horizontalLineGroundExtend,
  horizontalLineRoofExtend,
  verticalLine,
} from '../../unit/pathEmitters'
import { stair } from '../../unit/specEmitter'
import { DrawEntityMethods, chooseParser, makeParser } from '../drawEntity'
import { generateDrawEntityGrid } from './grid'

type Side = 'edge-wall' | 'wall-vert' | 'wall-hori'
type Center = 'wall-hori'
type Floor = 'stair' | 'wall-hori-extend'

export type DrawEntities = Side | Center | Floor

export const DrawMethods: DrawEntityMethods<DrawEntities> = {
  'edge-wall': makeParser([
    ...doubleHorizontalLine,
    ...doubleProceedingLine,
    verticalLine,
  ]),
  'wall-vert': makeParser(doubleProceedingLine),
  'wall-hori': makeParser(doubleHorizontalLine),
  'wall-hori-extend': makeParser([
    horizontalLineGroundExtend,
    horizontalLineRoofExtend,
  ]),
  stair: chooseParser(stair),
}

export const finalizer = generateFinalizer(DrawMethods, generateDrawEntityGrid)
