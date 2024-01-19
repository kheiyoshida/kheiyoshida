/**
 * Recursively make fields optional. 
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N 
  ? Acc[number] 
  : Enumerate<N, [...Acc, Acc['length']]>

/**
 * note: not inclusive for the latter. `IntRange<1,3>` becomes `1 | 2`
 */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>