import { RenderPosition } from '../../../../service/render/compose/renderSpec'
import { DrawSpec } from '../../draw/types'
import { Layer } from '../../frame/layer'
import { assumeSecondFrame } from '../../frame/altFrame'
import { proceedingLineGround } from './pathEmitters'

export type DrawSpecEmitter = (l: Layer) => DrawSpec

export type ConditionalDrawSpecEmitter = (
  position: RenderPosition,
  layerIndex: number
) => DrawSpecEmitter

export const stair: ConditionalDrawSpecEmitter = (_, li) =>
  li !== 5 ? stairFar : stairNear

export const stairFar: DrawSpecEmitter = (l) => [
  [l.middle.tl, l.inner.bl, l.inner.br, l.middle.tr],
  [l.middle.bl, l.middle.br],
  [l.inner.bl, [l.inner.bl[0], l.middle.bl[1]]],
  [l.inner.br, [l.inner.br[0], l.middle.br[1]]],
]

export const stairNear: DrawSpecEmitter = (
  l,
  secondInner = assumeSecondFrame(l.inner)
) => [
  [l.middle.tl, l.inner.bl, l.inner.br, l.middle.tr],
  [l.middle.bl, secondInner.bl, secondInner.br, l.middle.br],
  [l.inner.bl, secondInner.bl],
  [l.inner.br, secondInner.br],
]

export const stairFloor: ConditionalDrawSpecEmitter = (_, li) =>
  li !== 5 ? stairFloorFar : stairFloorNear

export const stairFloorFar: DrawSpecEmitter = (l) => [
  [l.middle.bl, l.middle.br],
  [l.inner.bl, [l.inner.bl[0], l.middle.bl[1]]],
  [l.inner.br, [l.inner.br[0], l.middle.br[1]]],
]

export const stairFloorNear: DrawSpecEmitter = (
  l,
  secondInner = assumeSecondFrame(l.inner)
) => [
  [l.inner.bl, secondInner.bl],
  [l.inner.br, secondInner.br],
]

export const proceedingLinesOnFloor:DrawSpecEmitter = (l) => [
  proceedingLineGround(RenderPosition.LEFT)(l),
  proceedingLineGround(RenderPosition.RIGHT)(l)
]