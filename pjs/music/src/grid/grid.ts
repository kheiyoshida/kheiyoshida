import { MakeScene } from 'mgnr-tone'
import { makeGridPositionManager, translateToPositionIndex } from './position'
import { GridDirection, GridPosition, GridPositionIndex, GridSubPosition } from './types'

export type SceneShiftInfo = {
  makeScene: MakeScene
  direction: GridDirection
  sceneAlignment: GridSubPosition
}

export type SceneGrid = ReturnType<typeof createSceneGrid>

export const createSceneGrid = (
  sceneMakers: { [position in GridPosition]: MakeScene },
  initialPos: GridPosition = 'center-middle',
  initialAlignment: GridSubPosition = 'center-middle'
) => {
  const [col, row] = translateToPositionIndex(initialPos, initialAlignment)
  const position = makeGridPositionManager(col, row)

  const moveInDirection = (direction: GridDirection): SceneShiftInfo => {
    position.move(direction)
    return {
      makeScene: sceneMakers[position.parentGridPosition],
      direction,
      sceneAlignment: position.childGridPosition,
    }
  }

  return {
    getInitialScene: () => sceneMakers[initialPos],
    moveInDirection,
    moveTowardsDestination: ([destCol, destRow]: [GridPositionIndex, GridPositionIndex]) => {
      const [currentCol, currentRow] = translateToPositionIndex(
        position.parentGridPosition,
        position.childGridPosition
      )
      const hori: GridDirection | undefined =
        destCol > currentCol ? 'right' : destCol < currentCol ? 'left' : undefined
      const vert: GridDirection | undefined =
        destRow > currentRow ? 'up' : destRow < currentRow ? 'down' : undefined
      return [hori, vert].reduce(
        (p, c) => (c ? moveInDirection(c) : p),
        undefined as unknown as SceneShiftInfo | undefined
      )
    },
    get current() {
      return position
    },
  }
}
