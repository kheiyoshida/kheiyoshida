import { Vector } from '../models'

/**
 * logical units width screen should be showing
 */
const ScreenLogicalViewportWidth = 2000

const halfWidth = ScreenLogicalViewportWidth / 2

// convert in-game logical position to NDC vector
export const positionToNDC = (gamePosition: Vector) => {
  return gamePosition.map(ndcScale) as Vector
}

// convert in-game logical values to normalized device coordinates
export const ndcScale = (value: number) => {
  return value / halfWidth
}
