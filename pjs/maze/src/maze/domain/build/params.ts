import { random, randomBetween, randomIntBetween } from "src/lib/random"
import { BuildParams } from "."

export const INITIAL_FLOOR_SIZE = 6
const MAX_FLOOR_SIZE = 13

/**
 * the deeper the player goes down, the floor must be larger.
 * but let's just keep it decently sized
 */
export const floorSize = (floor: number): number => {
  if (INITIAL_FLOOR_SIZE + floor < MAX_FLOOR_SIZE ) {
    return randomIntBetween(INITIAL_FLOOR_SIZE, INITIAL_FLOOR_SIZE + floor)
  } else {
    return randomIntBetween(MAX_FLOOR_SIZE - 4, MAX_FLOOR_SIZE)
  }
}

const DEFAULT_FILL_RATE = 0.44

/**
 * the deeprer the player goes down,
 * it must be more scarce alongside the floor's size.
 */
export const fillRate = (floor: number) => {
  if (floor % 5 === 0) {
    if (random(0.8) && floor % 10 === 0) {
      return 0.15
    } else {
      return 0.75
    }
  }
  if (floor < 5) {
    const min = {
      1: 0.1,
      2: 0.24,
      3: 0.3,
      4: 0.42,
    }[floor]!
    return randomBetween(min, min + 0.2)
  } else if (floor < 30) {
    return randomBetween(DEFAULT_FILL_RATE - floor / 100, DEFAULT_FILL_RATE)
  } else {
    return randomBetween(0.25, 0.5)
  }
}

const DEFAULT_CONN_RATE = 0.5

/**
 * detemine the rate if adjacent nodes should connect.
 * 1) for the first few floors, it must be easier to explore.
 * 2) every 5-10 floors, user must face a honeycomb-like floor.
 */
export const connRate = (floor: number) => {
  if (floor % 5 === 0) {
    return 0.88
  }
  if (floor < 5) {
    return 0.25 + floor * 0.05
  } else {
    return randomBetween(DEFAULT_CONN_RATE - 0.2, DEFAULT_CONN_RATE + 0.1)
  }
}

const MAX_FILL_RATE = 0.88

/**
 * provide paramters using state values
 */
export const paramBuild = (floor: number): BuildParams => {
  const size = floorSize(floor)
  const fill = Math.min(MAX_FILL_RATE, fillRate(floor))
  const conn = connRate(floor)
  return [size, fill, conn]
}

/**
 * adjust params when build fails to make complete maze
 */
export const adjustParams = ([size, fill, conn]: BuildParams): BuildParams => {
  return [size + 1, fill * 1.05, conn]
}