import { ListenableState } from '.'
import { createRandomSelect } from '../../../lib/random'

export enum VisionStrategy {
  normal = 'normal',
  highWall = 'highWall',
  floor = 'floor',
}

export const chooseStrategy = ({ floor }: ListenableState): VisionStrategy => {
  return defaultSelector(floor)
}

const floorStrategyMap: { [floor: number]: VisionStrategy } = {
  1: VisionStrategy.normal,
  2: VisionStrategy.normal,
  3: VisionStrategy.normal,
}

const includeFloorSelect =
  (randomSelect: ReturnType<typeof createRandomSelect<VisionStrategy>>) =>
  (floor: number): VisionStrategy => {
    if (!floorStrategyMap[floor]) {
      const strategy = randomSelect()
      floorStrategyMap[floor] = strategy
    }
    return floorStrategyMap[floor]
  }

const defaultSelector = includeFloorSelect(
  createRandomSelect<VisionStrategy>([
    [70, VisionStrategy.normal],
    [30, VisionStrategy.floor],
    [30, VisionStrategy.highWall],
  ])
)
