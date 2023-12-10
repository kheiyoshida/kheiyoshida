import { randomIntBetween } from "random/random"
import { Range } from "./types"

export const pickRange = (numOrRange: number|Range) => {
  if (typeof numOrRange === 'number') {
    return numOrRange
  } else {
    return randomIntBetween(numOrRange.min, numOrRange.max)
  }
}