import { Vector3D } from '../vector'

/**
 * logical units width screen should be showing
 */
const ScreenLogicalViewportWidth = 2000

/**
 * 1000 becomes 1.0 in NDC scale
 */
const ndcUnit = ScreenLogicalViewportWidth / 2

// convert in-game logical position to NDC vector
export const positionToNDC = (gamePosition: Vector3D) => {
  return gamePosition.map(ndcScale) as Vector3D
}

// convert in-game logical values to normalized device coordinates
export const ndcScale = (value: number) => {
  return value / ndcUnit
}
