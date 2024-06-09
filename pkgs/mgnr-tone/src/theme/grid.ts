import { IntRange, clamp } from 'utils'
import { SceneMaker } from './scene'

export type GridPositionIndex = IntRange<1, 10>

export type SceneGrid = ReturnType<typeof createSceneGrid>
export type GridRow = 'top' | 'middle' | 'bottom'
export type GridColumn = 'left' | 'center' | 'right'
export type GridPosition = `${GridColumn}-${GridRow}`
export type GridAlignment = `${GridColumn}-${GridRow}`
export type GridDirection = 'up' | 'down' | 'left' | 'right'

export type SceneShiftInfo = {
  theme: SceneMaker | null
  direction: GridDirection
  themeAlignment: GridAlignment
}

export const createSceneGrid = (themeMakers: { [position in GridPosition]: SceneMaker }) => {
  const position = createGridPositionManager()
  let lastGridPosition: GridPosition = position.grid
  return {
    getInitialTheme: () => {
      return themeMakers[lastGridPosition]
    },
    move: (direction: GridDirection): SceneShiftInfo => {
      position.move(direction)
      if (lastGridPosition === position.grid) {
        return {
          theme: null,
          direction,
          themeAlignment: position.theme,
        }
      } else {
        lastGridPosition = position.grid
        return {
          theme: themeMakers[position.grid],
          direction,
          themeAlignment: position.theme,
        }
      }
    },
    get current() {
      return position
    }
  }
}

export const createGridPositionManager = (
  initialCol: GridPositionIndex = 5,
  initialRow: GridPositionIndex = 5
) => {
  let col: GridPositionIndex = initialCol
  let row: GridPositionIndex = initialRow
  return {
    get grid(): GridPosition {
      return translateGridPosition(col, row)
    },
    get theme(): GridPosition {
      return translateThemeAlignment(col, row)
    },
    move: (direction: GridDirection) => {
      if (direction === 'up') row = clampGridPositionIndex(row + 3)
      if (direction === 'down') row = clampGridPositionIndex(row - 3)
      if (direction === 'left') col = clampGridPositionIndex(col - 3)
      if (direction === 'right') col = clampGridPositionIndex(col + 3)
    },
  }
}

export const clampGridPositionIndex = (number: number): GridPositionIndex =>
  clamp(number, 2, 8) as GridPositionIndex

export const translateGridPosition = (
  col: GridPositionIndex,
  row: GridPositionIndex
): GridPosition => {
  return `${translateGridColPosition(col)}-${translateGriwRowPosition(row)}`
}

const translateGridColPosition = (index: number): GridColumn => {
  if (index < 4) return 'left'
  if (index < 7) return 'center'
  return 'right'
}

const translateGriwRowPosition = (index: number): GridRow => {
  if (index < 4) return 'bottom'
  if (index < 7) return 'middle'
  return 'top'
}

export const translateThemeAlignment = (
  col: GridPositionIndex,
  row: GridPositionIndex
): GridPosition => {
  return `${translateThemeColPosition(col)}-${translateThemeRowPosition(row)}`
}

const translateThemeColPosition = (index: number): GridColumn => {
  const i = (index - 1) % 3
  if (i === 0) return 'left'
  if (i === 1) return 'center'
  if (i === 2) return 'right'
  throw Error(`unkwon index ${index}`)
}

const translateThemeRowPosition = (index: number): GridRow => {
  const i = (index - 1) % 3
  if (i === 0) return 'bottom'
  if (i === 1) return 'middle'
  if (i === 2) return 'top'
  throw Error(`unkwon index ${index}`)
}
