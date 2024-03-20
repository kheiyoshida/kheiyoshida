import { pipe } from 'utils'
import { Node } from '../../store/entities/matrix/node'
import { Direction } from '../maze/direction'
import { toPathSpec } from './nodeSpec'
import { RenderGrid, convertToRenderGrid } from './renderSpec'
import { store } from '../../store'
import { getPath } from '../maze/maze'

export const getRenderGridFromCurrentState = () => {
  return composeRenderGrid(getPath(), store.current.direction)
}

export const composeRenderGrid = (path: Node[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
