import { clamp, IntRange } from 'utils'
import { MakeScene } from './scene'

/**
 * SceneGrid is a 9x9 grid.
 * Columns and rows can be obtained by 1-9 indices
 */
export type GridPositionIndex = IntRange<1, 10>

export type SceneGrid = ReturnType<typeof createSceneGrid>
export type GridRow = 'top' | 'middle' | 'bottom'
export type GridColumn = 'left' | 'center' | 'right'
export type GridPosition = `${GridColumn}-${GridRow}`
export type GridSubPosition = `${GridColumn}-${GridRow}`
export type GridDirection = 'up' | 'down' | 'left' | 'right'

export type SceneShiftInfo = {
  makeScene: MakeScene
  direction: GridDirection
  sceneAlignment: GridSubPosition
}

export const createSceneGrid = (
  sceneMakers: { [position in GridPosition]: MakeScene },
  initialPos: GridPosition = 'center-middle',
  initialAlignment: GridSubPosition = 'center-middle'
) => {
  const [col, row] = translateToPositionIndex(initialPos, initialAlignment)
  const position = createGridPositionManager(col, row)

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

export const createGridPositionManager = (
  initialCol: GridPositionIndex = 5,
  initialRow: GridPositionIndex = 5,
  allowOverflow = false
) => {
  let col: GridPositionIndex = initialCol
  let row: GridPositionIndex = initialRow
  const clamp = clampGridPositionIndex(allowOverflow)
  return {
    get parentGridPosition(): GridPosition {
      return translateParentGridPosition(col, row)
    },
    get childGridPosition(): GridPosition {
      return translateChildGridPosition(col, row)
    },
    move: (direction: GridDirection) => {
      if (direction === 'up') row = clamp(row + 1)
      if (direction === 'down') row = clamp(row - 1)
      if (direction === 'left') col = clamp(col - 1)
      if (direction === 'right') col = clamp(col + 1)
    },
    get isOnEdge() {
      if (allowOverflow) return false
      return col === 1 || col === 9 || row === 1 || row === 9
    },
  }
}

export const clampGridPositionIndex =
  (allowOverflow: boolean) =>
  (number: number): GridPositionIndex => {
    if (number < 1 && allowOverflow) return 9 as GridPositionIndex
    if (number > 9 && allowOverflow) return 1 as GridPositionIndex
    return clamp(number, 1, 9) as GridPositionIndex
  }

export const translateParentGridPosition = (
  col: GridPositionIndex,
  row: GridPositionIndex
): GridPosition => {
  return `${translateParentColPosition(col)}-${translateParentRowPosition(row)}`
}

const translateParentColPosition = (index: number): GridColumn => {
  if (index < 4) return 'left'
  if (index < 7) return 'center'
  return 'right'
}

const translateParentRowPosition = (index: number): GridRow => {
  if (index < 4) return 'bottom'
  if (index < 7) return 'middle'
  return 'top'
}

export const translateChildGridPosition = (
  col: GridPositionIndex,
  row: GridPositionIndex
): GridPosition => {
  return `${translateChildColPosition(col)}-${translateChildRowPosition(row)}`
}

const translateChildColPosition = (index: number): GridColumn => {
  const i = (index - 1) % 3
  if (i === 0) return 'left'
  if (i === 1) return 'center'
  if (i === 2) return 'right'
  throw Error(`unknown index ${index}`)
}

const translateChildRowPosition = (index: number): GridRow => {
  const i = (index - 1) % 3
  if (i === 0) return 'bottom'
  if (i === 1) return 'middle'
  if (i === 2) return 'top'
  throw Error(`unknown index ${index}`)
}

export const translateToPositionIndex = (
  parent: GridPosition,
  child: GridSubPosition
): [GridPositionIndex, GridPositionIndex] => {
  const [gridCol, gridRow] = parent.split('-')
  const [alignCol, alignRow] = child.split('-')
  const cols: GridColumn[] = ['left', 'center', 'right']
  const rows: GridRow[] = ['bottom', 'middle', 'top']
  const col = cols.findIndex((c) => c === gridCol) * 3 + cols.findIndex((c) => c === alignCol) + 1
  const row = rows.findIndex((r) => r === gridRow) * 3 + rows.findIndex((r) => r === alignRow) + 1
  return [col, row] as [GridPositionIndex, GridPositionIndex]
}
