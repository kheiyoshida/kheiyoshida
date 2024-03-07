import { RenderPosition } from '../../../compose/renderSpec'
import { DrawPath } from '../../draw/patterns/factory'
import { Layer } from '../../frame/layer'
import { omitLength } from './modulators'

export type DrawPathEmitter = (
  p: RenderPosition,
  layerIndex?: number
) => (l: Layer) => DrawPath

/**
 * create `DrawPathEmitter with fixed position
 */
export const fixed =
  (p: RenderPosition, emitter: DrawPathEmitter): DrawPathEmitter =>
  (_: RenderPosition, li?: number) =>
    emitter(p, li)

export const horizontalLineRoof: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (l) => [l.middle.tl, l.middle.tr]
    : p === RenderPosition.LEFT
    ? (l) => [[l.outer.tl[0], l.middle.tl[1]], l.middle.tl]
    : (l) => [l.middle.tr, [l.outer.tr[0], l.middle.tr[1]]]

export const horizontalLineGroundFront: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (l) => [l.middle.bl, l.middle.br]
    : p === RenderPosition.LEFT
    ? (l) => [[l.outer.bl[0], l.middle.bl[1]], l.middle.bl]
    : (l) => [l.middle.br, [l.outer.br[0], l.middle.br[1]]]

export const horizontalLineGroundBack: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (l) => [l.inner.bl, l.inner.br]
    : p === RenderPosition.LEFT
    ? (l) => omitLength([[l.outer.bl[0], l.inner.bl[1]], l.inner.bl], l, p)
    : (l) => omitLength([l.inner.br, [l.outer.br[0], l.inner.br[1]]], l, p)

export const horizontalLineGroundExtend: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (l) => []
    : p === RenderPosition.LEFT
    ? (l) => [[l.outer.bl[0], l.inner.bl[1]], [l.middle.bl[0], l.inner.bl[1]]]
    : (l) => [[l.middle.br[0], l.inner.br[1]], [l.outer.br[0], l.inner.br[1]]]

export const horizontalLineRoofExtend: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (l) => []
    : p === RenderPosition.LEFT
    ? (l) => [[l.outer.tl[0], l.inner.tl[1]], [l.middle.tl[0], l.inner.tl[1]]]
    : (l) => [[l.middle.tr[0], l.inner.tr[1]], [l.outer.tr[0], l.inner.tr[1]]]

export const horizontalLineGroundCliffFront: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (l) => [l.middle.bl, l.middle.br]
    : p === RenderPosition.LEFT
    ? (l) => [[l.outer.bl[0], l.middle.bl[1]], l.middle.bl]
    : (l) => [l.middle.br, [l.outer.br[0], l.middle.br[1]]]

export const horizontalLineGroundCliffBack: DrawPathEmitter = (p) =>
  p === RenderPosition.CENTER
    ? (_) => []
    : p === RenderPosition.LEFT
    ? (l) => [[l.outer.bl[0], l.inner.bl[1]], l.inner.bl]
    : (l) => [l.inner.br, [l.outer.br[0], l.inner.br[1]]]

export const proceedingLineGround: DrawPathEmitter = (p) =>
  p === RenderPosition.LEFT
    ? (l) => [l.middle.bl, l.inner.bl]
    : (l) => [l.inner.br, l.middle.br]

export const proceedingLineRoof: DrawPathEmitter = (p) =>
  p === RenderPosition.LEFT
    ? (l) => [l.middle.tl, l.inner.tl]
    : (l) => [l.inner.tr, l.middle.tr]

export const verticalLine: DrawPathEmitter = (p, li) =>
  li === 5
    ? (_) => []
    : p === RenderPosition.LEFT
    ? (l) => [l.middle.tl, l.middle.bl]
    : (l) => [l.middle.tr, l.middle.br]
