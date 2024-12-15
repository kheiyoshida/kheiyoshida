import { pipe } from 'utils'
import { Node } from '../../../../store/entities/matrix/node.ts'
import { Direction } from '../../../../utils/direction.ts'
import { toPathSpec } from './nodeSpec.ts'
import { RenderGrid, convertToRenderGrid, RenderGridLayer } from './renderSpec.ts'
import { store } from '../../../../store'
import { getPath } from '../../../mutate/maze'

export * from './grid.ts'
export type { RenderGrid, RenderGridLayer }


export const getRenderGridFromCurrentState = () => {
  return composeRenderGrid(getPath(), store.current.direction)
}

export const composeRenderGrid = (path: Node[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
