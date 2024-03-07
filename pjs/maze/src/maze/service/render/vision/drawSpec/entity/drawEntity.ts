import { RenderPosition } from '../../../compose/renderSpec'
import { DrawSpec } from '../../draw/types'
import { Layer } from '../../frame/layer'
import { DrawPathEmitter } from '../unit/pathEmitters'
import { ConditionalDrawSpecEmitter, DrawSpecEmitter } from '../unit/specEmitter'

export type DrawEntity = string

export type DrawEntityGrid<
  Patterns extends DrawEntity,
  Entity = Patterns | null,
  Layer = Entity[] | null,
> = Layer[]

export type DrawEntityParser = (l: Layer, p: RenderPosition, li: number) => DrawSpec

export type DrawEntityMethods<K extends string> = {
  [k in K]: DrawEntityParser
}

export const NUM_OF_LAYERS = 6
export const FIRST_LAYER_INDEX = 0
export const LAST_LAYER_INDEX = NUM_OF_LAYERS - 1

/**
 * aggeregate different path emitters into a spec emitter,
 * using the position and layer index
 */
export const aggregate =
  (p: RenderPosition, li: number, fns: DrawPathEmitter[]): DrawSpecEmitter =>
  (l) =>
    fns.map((f) => f(p, li)).map((f) => f(l))

/**
 * make a DrawEntityParser from a collection of `PathEmitter`s.
 */
export const makeParser =
  (pathEmitters: DrawPathEmitter[], specEmitters: DrawSpecEmitter[] = []): DrawEntityParser =>
  (layer: Layer, position: RenderPosition, layerIndex: number) =>
    specEmitters
      .concat(aggregate(position, layerIndex, pathEmitters))
      .reduce((spec, emitter) => spec.concat(emitter(layer)), [] as DrawSpec)

/**
 * choose conditonal spec emitter
 */
export const chooseParser =
  (conditionalEmitter: ConditionalDrawSpecEmitter): DrawEntityParser =>
  (layer: Layer, position: RenderPosition, layerIndex: number) =>
    conditionalEmitter(position, layerIndex)(layer)
