/**
 * vector for hsl representation
 *
 * hue value expects a degree in between 0 and 360 where 0, 120, 240 represents red, green, blue
 *
 * saturation & lightness is meant to be between 0.0 and 1.0
 */
export type HSL = [hue: number, saturation: number, lightness: number]

/**
 * vector for rgb representation.
 *
 * it can have 0-255 range (for human) or 0-1 range (for shader) for values
 */
export type RGB = [r: number, g: number, b: number]
