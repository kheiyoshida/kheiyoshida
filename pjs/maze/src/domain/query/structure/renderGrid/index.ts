import { pipe } from 'utils'
import { Node } from '../../../../store/entities/matrix/node.ts'
import { Direction } from '../../../../utils/direction.ts'
import { toPathSpec } from './nodeSpec.ts'
import { RenderGrid, convertToRenderGrid, RenderLayer, RenderPattern } from './renderSpec.ts'
import { store } from '../../../../store'
import { getPath } from '../../../mutate/maze'

export type { RenderGrid, RenderLayer, RenderPattern }

export const getRenderGridFromCurrentState = () => {
  return composeRenderGrid(getPath(), store.current.direction)
}

export const composeRenderGrid = (path: Node[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
