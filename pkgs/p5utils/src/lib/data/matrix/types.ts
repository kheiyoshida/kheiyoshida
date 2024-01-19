export type RGBA = [number, number, number, number]

export type Matrix<T> = T[][]
export type RGBAMatrix = Matrix<RGBA>
export type ContrastMatrix = Matrix<number | null>
export type RegionMatrix = Matrix<boolean>

export type MatrixLoc = [number, number]

/**
 * collection of relative values that indicates cells to invade
 */
export type RegionVector = MatrixLoc[]

export type MatrixDirection = 't' | 'r' | 'b' | 'l' | 'tr' | 'br' | 'bl' | 'tl'

export type MatrixDraw<T> = (x: number, y: number, val: T) => void
