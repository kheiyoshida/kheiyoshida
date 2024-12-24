import { pipe } from 'utils'
import { Block } from '../../../entities/maze/block.ts'
import { Direction } from '../../../entities/utils/direction.ts'
import { toPathSpec } from './nodeSpec.ts'
import { convertToRenderGrid, RenderGrid, RenderGridLayer } from './renderSpec.ts'
import { store } from '../../../../store'
import { getPath } from '../../../mutate/maze'

export * from './grid.ts'
export type { RenderGrid, RenderGridLayer }

export const getRenderGridFromCurrentState = () => {
  return composeRenderGrid(getPath(), store.current.direction)
}

export const composeRenderGrid = (path: Block[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
