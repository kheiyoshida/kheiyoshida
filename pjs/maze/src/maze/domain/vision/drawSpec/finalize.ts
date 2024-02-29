import { RenderGrid } from '../../../service/render/compose/renderSpec'
import { DrawSpec } from '../draw/types'
import { Frame } from '../frame'
import { extractLayer } from '../frame/layer'
import { DrawEntity, DrawEntityGrid, DrawEntityMethods } from './entity/drawEntity'

/**
 * turn entity grid into an array of draw spec
 */
export const finalizeDrawSpec = <DE extends DrawEntity>(
  methods: DrawEntityMethods<DE>,
  grid: DrawEntityGrid<DE>,
  frames: Frame[]
): DrawSpec[][] =>
  grid
    .map((layer, li) =>
      layer
        ? layer
            .map((e, pos) => (e ? methods[e](extractLayer(frames, li), pos, li) : null))
            .filter((unit): unit is DrawSpec => unit !== null)
        : null
    )
    .filter((unit): unit is DrawSpec[] => unit !== null)

/**
 * final function that service layer can use to generate draw specs
 */
export type DrawSpecFinalizer = (grid: RenderGrid, frames: Frame[]) => DrawSpec[][]

/**
 * render grid -> draw entity grid
 */
type GenerateEntityGrid<DE extends DrawEntity> = (grid: RenderGrid) => DrawEntityGrid<DE>

/**
 * generate finalizer using
 */
export const generateFinalizer =
  <DE extends DrawEntity>(
    methods: DrawEntityMethods<DE>,
    genGrid: GenerateEntityGrid<DE>
  ): DrawSpecFinalizer =>
  (grid: RenderGrid, frames: Frame[]) =>
    finalizeDrawSpec(methods, genGrid(grid), frames)
