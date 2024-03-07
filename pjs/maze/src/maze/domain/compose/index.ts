import { Node } from '../../store/entities/matrix/node'
import { Direction } from '../maze/direction'
import { pipe } from 'utils'
import { toPathSpec } from './nodeSpec'
import { RenderGrid, convertToRenderGrid } from './renderSpec'
import * as maze from '../../domain/maze/maze'

export const getRenderGridFromCurrentState = () => {
  return composeRenderGrid(maze.getPath(), maze.query.direction)
}

export const composeRenderGrid = (path: Node[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
