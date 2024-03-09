import { RenderGrid } from '../../../../domain/compose/renderSpec'
import { DrawSpec } from '../draw/types'
import { Frame } from '../frame'
import { extractLayer } from '../frame/layer'
import { DrawEntity, DrawEntityGrid, DrawEntityMethods } from './entity/drawEntity'

export const finalizeDrawSpec = <DE extends DrawEntity>(
  methods: DrawEntityMethods<DE>,
  entityGrid: DrawEntityGrid<DE>,
  frames: Frame[]
): DrawSpec[][] =>
  entityGrid
    .map((layer, li) =>
      layer
        ? layer
            .map((e, pos) => (e ? methods[e](extractLayer(frames, li), pos, li) : null))
            .filter((unit): unit is DrawSpec => unit !== null)
        : null
    )
    .filter((unit): unit is DrawSpec[] => unit !== null)

type ConvertToDrawEntityGrid<DE extends DrawEntity> = (grid: RenderGrid) => DrawEntityGrid<DE>

export type FinalizeDrawSpecs = (grid: RenderGrid, frames: Frame[]) => DrawSpec[][]

export const generateFinalizer =
  <DE extends DrawEntity>(
    methods: DrawEntityMethods<DE>,
    convertGrid: ConvertToDrawEntityGrid<DE>
  ): FinalizeDrawSpecs =>
  (renderGrid: RenderGrid, frames: Frame[]) =>
    finalizeDrawSpec(methods, convertGrid(renderGrid), frames)
