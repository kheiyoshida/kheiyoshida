
/**
 * number range
 */
export type Range = {
  min: number
  max: number
}

/**
 * Recursively make fields optional. 
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}
