import { Node } from 'src/maze/domain/matrix/node'
import { Direction } from 'src/maze/domain/maze/direction'
import { pipe } from 'src/maze/utils'
import { toNodeSpec } from './nodeSpec'
import { RenderGrid, convertToRenderGrid } from './renderSpec'

/**
 * compose draw specs
 */
export const composeRender = (
  path: Node[],
  direction: Direction,
): RenderGrid =>
  pipe(
    toNodeSpec(direction)(path),
    convertToRenderGrid,
  )
