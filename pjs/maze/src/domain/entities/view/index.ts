import { Block } from '../maze/block.ts'
import { Direction } from '../utils/direction.ts'
import { toPathSpec } from './path.ts'
import { convertToLogicalView, LogicalView, LogicalViewLayer } from './logicalView.ts'

export * from '../utils/grid.ts'
export type { LogicalView, LogicalViewLayer }

export const composeLogicalView = (path: Block[], direction: Direction): LogicalView => {
  return convertToLogicalView(toPathSpec(path, direction))
}
