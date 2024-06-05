import { IntRange, clamp } from 'utils'
import { ThemeMaker } from './theme'

export type GridPositionIndex = IntRange<1, 10>

export type ThemeGrid = ReturnType<typeof createThemeGrid>
export type ThemeGridRow = 'top' | 'middle' | 'bottom'
export type ThemeGridColumn = 'left' | 'center' | 'right'
export type ThemeGridPosition = `${ThemeGridColumn}-${ThemeGridRow}`
export type ThemeAlignment = `${ThemeGridColumn}-${ThemeGridRow}`
export type ThemeGridDirection = 'up' | 'down' | 'left' | 'right'

export type ThemeShiftInfo = {
  theme: ThemeMaker | null
  direction: ThemeGridDirection
  themeAlignment: ThemeAlignment
}

export const createThemeGrid = (themeMakers: { [position in ThemeGridPosition]: ThemeMaker }) => {
  const position = createGridPositionManager()
  let lastGridPosition: ThemeGridPosition = position.grid
  return {
    getInitialTheme: () => {
      return themeMakers[lastGridPosition]
    },
    move: (direction: ThemeGridDirection): ThemeShiftInfo => {
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
  }
}

export const createGridPositionManager = (
  initialCol: GridPositionIndex = 5,
  initialRow: GridPositionIndex = 5
) => {
  let col: GridPositionIndex = initialCol
  let row: GridPositionIndex = initialRow
  return {
    get grid(): ThemeGridPosition {
      return translateGridPosition(col, row)
    },
    get theme(): ThemeGridPosition {
      return translateThemeAlignment(col, row)
    },
    move: (direction: ThemeGridDirection) => {
      if (direction === 'up') row = clampGridPositionIndex(row + 1)
      if (direction === 'down') row = clampGridPositionIndex(row - 1)
      if (direction === 'left') col = clampGridPositionIndex(col - 1)
      if (direction === 'right') col = clampGridPositionIndex(col + 1)
    },
  }
}

export const clampGridPositionIndex = (number: number): GridPositionIndex =>
  clamp(number, 1, 9) as GridPositionIndex

export const translateGridPosition = (
  col: GridPositionIndex,
  row: GridPositionIndex
): ThemeGridPosition => {
  return `${translateGridColPosition(col)}-${translateGriwRowPosition(row)}`
}

const translateGridColPosition = (index: number): ThemeGridColumn => {
  if (index < 4) return 'left'
  if (index < 7) return 'center'
  return 'right'
}

const translateGriwRowPosition = (index: number): ThemeGridRow => {
  if (index < 4) return 'bottom'
  if (index < 7) return 'middle'
  return 'top'
}

export const translateThemeAlignment = (
  col: GridPositionIndex,
  row: GridPositionIndex
): ThemeGridPosition => {
  return `${translateThemeColPosition(col)}-${translateThemeRowPosition(row)}`
}

const translateThemeColPosition = (index: number): ThemeGridColumn => {
  const i = (index - 1) % 3
  if (i === 0) return 'left'
  if (i === 1) return 'center'
  if (i === 2) return 'right'
  throw Error(`unkwon index ${index}`)
}

const translateThemeRowPosition = (index: number): ThemeGridRow => {
  const i = (index - 1) % 3
  if (i === 0) return 'bottom'
  if (i === 1) return 'middle'
  if (i === 2) return 'top'
  throw Error(`unkwon index ${index}`)
}
