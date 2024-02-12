export type RGBAIndexes = [ri:number, gi:number, bi:number, ai: number]
export type RGBA = [r:number, g:number, b:number, a: number]

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
