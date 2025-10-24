import { Block } from '../../core/level/legacy/block.ts'
import { Direction } from '../../core/grid/direction.ts'
import { toPathSpec } from './path.ts'
import { convertToLogicalView, LogicalView, LogicalViewLayer } from './logicalView.ts'

export * from '../../core/_legacy/grid.ts'
export type { LogicalView, LogicalViewLayer }

export const composeLogicalView = (path: Block[], direction: Direction): LogicalView => {
  return convertToLogicalView(toPathSpec(path, direction))
}
