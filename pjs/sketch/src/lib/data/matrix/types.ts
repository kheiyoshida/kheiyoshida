type RGBA = [number, number, number, number]

type Matrix<T> = T[][]
type RGBAMatrix = Matrix<RGBA>
type ContrastMatrix = Matrix<number | null>
type RegionMatrix = Matrix<boolean>

type MatrixLoc = [number, number]

/**
 * collection of relative values that indicates cells to invade
 */
type RegionVector = MatrixLoc[]

type MatrixDirection = 't' | 'r' | 'b' | 'l' | 'tr' | 'br' | 'bl' | 'tl'

type MatrixDraw<T> = (x: number, y: number, val: T) => void
