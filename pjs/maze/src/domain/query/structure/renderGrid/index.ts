import { pipe } from 'utils'
import { Block } from '../../../entities/maze/block.ts'
import { Direction } from '../../../entities/utils/direction.ts'
import { toPathSpec } from './nodeSpec.ts'
import { convertToRenderGrid, RenderGrid, RenderGridLayer } from './renderSpec.ts'

import { game, player } from '../../../game/setup.ts'

export * from '../../../entities/utils/grid.ts'
export type { RenderGrid, RenderGridLayer }

export const getRenderGridFromCurrentState = () => {
  return composeRenderGrid(game.getPath(), player.direction)
}

export const composeRenderGrid = (path: Block[], direction: Direction): RenderGrid =>
  pipe(toPathSpec(direction)(path), convertToRenderGrid)
