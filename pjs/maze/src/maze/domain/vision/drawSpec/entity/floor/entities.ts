import { RenderPosition } from '../../../../../service/render/compose/renderSpec'
import {
  fixed,
  horizontalLineGroundBack,
  horizontalLineGroundFront,
  proceedingLineGround,
} from '../../unit/pathEmitters'
import { stairFloor } from '../../unit/specEmitter'
import { DrawEntityMethods, chooseParser, makeParser } from '../drawEntity'
import { generateFinalizer } from '../../finalize'
import { generateDrawEntityGrid } from './grid'

type Side = 'path-side' | 'path-side-forefront'
type Floor = 'stair' | 'f' | 'l' | 'r' | 'fl' | 'fr' | 'flr' | 'lr' | 'deadend'

export type DrawEntities = Side | Floor

export const DrawMethods: DrawEntityMethods<DrawEntities> = {
  'path-side': makeParser([
    horizontalLineGroundBack,
    horizontalLineGroundFront,
  ]),
  'path-side-forefront': makeParser([
    horizontalLineGroundBack,
  ]),
  stair: chooseParser(stairFloor),
  f: makeParser([
    fixed(RenderPosition.LEFT, proceedingLineGround),
    fixed(RenderPosition.RIGHT, proceedingLineGround),
  ]),
  l: makeParser([
    horizontalLineGroundBack,
    fixed(RenderPosition.RIGHT, proceedingLineGround),
  ]),
  r: makeParser([
    horizontalLineGroundBack,
    fixed(RenderPosition.LEFT, proceedingLineGround),
  ]),
  fl: makeParser([fixed(RenderPosition.RIGHT, proceedingLineGround)]),
  fr: makeParser([fixed(RenderPosition.LEFT, proceedingLineGround)]),
  flr: makeParser([]),
  lr: makeParser([horizontalLineGroundBack]),
  deadend: makeParser([
    horizontalLineGroundBack,
    fixed(RenderPosition.LEFT, proceedingLineGround),
    fixed(RenderPosition.RIGHT, proceedingLineGround),
  ]),
}

export const finalizer = generateFinalizer(DrawMethods, generateDrawEntityGrid)
