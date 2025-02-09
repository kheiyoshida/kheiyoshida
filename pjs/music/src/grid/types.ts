import { IntRange } from 'utils'

/**
 * SceneGrid is a 9x9 grid.
 * Columns and rows can be obtained by 1-9 indices
 */
export type GridPositionIndex = IntRange<1, 10>

export type GridRow = 'top' | 'middle' | 'bottom'
export type GridColumn = 'left' | 'center' | 'right'

/**
 * Position for the parent cell in 3x3 grid
 */
export type GridPosition = `${GridColumn}-${GridRow}`

/**
 * Position for the child cell within parent cell 3x3 grid
 */
export type GridSubPosition = `${GridColumn}-${GridRow}`

export type GridDirection = 'up' | 'down' | 'left' | 'right'
