/**
 * convert percent in float number into float with 2 numbers after precision
 */
export const roundPercent = (n: number) => Math.round(n * 100) / 100

/**
 * convert percent in int into float number
 */
export const toFloatPercent = (n: number) => n * 0.01