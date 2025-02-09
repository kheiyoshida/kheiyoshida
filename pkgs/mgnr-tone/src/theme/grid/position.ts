import { clamp } from 'utils'
import { GridColumn, GridDirection, GridPosition, GridPositionIndex, GridRow, GridSubPosition } from './types'

export const makeGridPositionManager = (
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

export const translateParentGridPosition = (col: GridPositionIndex, row: GridPositionIndex): GridPosition => {
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

export const translateChildGridPosition = (col: GridPositionIndex, row: GridPositionIndex): GridPosition => {
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
