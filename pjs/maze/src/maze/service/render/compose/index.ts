import { Node } from '../../../domain/matrix/node'
import { Direction } from '../../../domain/maze/direction'
import { pipe } from 'utils'
import { toNodeSpec } from './nodeSpec'
import { RenderGrid, convertToRenderGrid } from './renderSpec'

/**
 * compose draw specs
 */
export const composeRender = (path: Node[], direction: Direction): RenderGrid =>
  pipe(toNodeSpec(direction)(path), convertToRenderGrid)
