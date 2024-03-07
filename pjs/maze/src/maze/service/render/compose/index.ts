import { Node } from '../../../store/entities/matrix/node'
import { Direction } from '../../../domain/maze/direction'
import { pipe } from 'utils'
import { toPathSpec } from './nodeSpec'
import { RenderGrid, convertToRenderGrid } from './renderSpec'

export const composeRenderGrid = (path: Node[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
