import { ListenableState } from '.'
import { createRandomSelect } from '../../../lib/random'

export type VisionStrategy = 'normal' | 'highWall' | 'floor'

export const chooseStrategy = ({ floor }: ListenableState): VisionStrategy => {
  return defaultSelector(floor)
}

const floorStrategyMap: { [floor: number]: VisionStrategy } = {
  1: 'normal',
  2: 'normal',
  3: 'normal',
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
    [70, 'normal'],
    [30, 'floor'],
    [30, 'highWall'],
  ])
)
