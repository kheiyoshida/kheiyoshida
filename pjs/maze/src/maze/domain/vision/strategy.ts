import { createRandomSelect } from 'src/lib/random'
import { ListenableState } from '.'

export type VisionStrategy = 'normal' | 'highWall' | 'floor'

const floorStrategyMap: { [floor: number]: VisionStrategy } = {
  1: 'normal',
  2: 'normal',
  3: 'normal',
}

/**
 * for consistency
 */
const floorSelector =
  (selector: ReturnType<typeof createRandomSelect<VisionStrategy>>) =>
  (floor: number): VisionStrategy => {
    if (!floorStrategyMap[floor]) {
      const strategy = selector()
      floorStrategyMap[floor] = strategy
    }
    return floorStrategyMap[floor]
  }

const defaultSelector = floorSelector(
  createRandomSelect<VisionStrategy>([
    [70, 'normal'],
    [30, 'floor'],
    // [30, 'highWall'],
  ])
)

export const chooseStrategy = ({ floor }: ListenableState): VisionStrategy => {
  return defaultSelector(floor)
}
