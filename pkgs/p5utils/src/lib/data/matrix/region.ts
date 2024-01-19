import { randomItemFromArray } from 'utils'
import {
  MatrixRangeError,
  createEmptyMatrix,
  directionLoc,
  iterateMatrix,
  lookupMatrix,
  randomMatrixLoc,
  swapMatrix
} from './matrix'
import { MatrixDirection, MatrixLoc, RegionMatrix } from './types'

export const createRegion = (sizeX: number, sizeY: number): RegionMatrix => {
  return createEmptyMatrix(sizeX, sizeY, false)
}

export const randomSeed = (matrix: RegionMatrix) => {
  const init = randomMatrixLoc(matrix)
  swapMatrix(matrix, init, true)
}

/**
 * get current region as a flat array
 */
export const getRegion = (matrix: RegionMatrix): MatrixLoc[] => {
  const locs: MatrixLoc[] = []
  iterateMatrix(matrix, (x, y, val) => {
    if (val === true) {
      locs.push([x, y])
    }
  })
  return locs
}

/**
 * fill empty space in the edge
 * side effect
 */
export const growRegion = (matrix: RegionMatrix) => {
  const edge = randomRegionEdge(matrix)
  swapMatrix(matrix, edge, true)
  return matrix
}

/**
 * check adjacent cells' availability
 */
export const checkAdjacent = (matrix: RegionMatrix, loc: MatrixLoc): MatrixDirection[] => {
  return (['t', 'r', 'b', 'l'] as MatrixDirection[]).filter((d) =>
    lookupRegion(matrix, directionLoc(loc, d))
  )
}

/**
 * get region's "edge" randomly
 */
export const randomRegionEdge = (
  matrix: RegionMatrix,
  direction: MatrixDirection[] = [],
  tried: MatrixLoc[] = [],
  retry = 0
): MatrixLoc => {
  const locs = getRegion(matrix).filter((l) => !tried.includes(l))
  const loc = randomItemFromArray(locs)
  const adj = checkAdjacent(matrix, loc)
  if (adj.length > 0) {
    return directionLoc(loc, randomItemFromArray(adj))
  } else {
    if (retry < 100) return randomRegionEdge(matrix, direction, [...tried, loc], retry + 1)
    else
      throw Error(
        `recursion exceeded max retry: ${JSON.stringify(
          { matrix, locs, loc, adj, retry, tried },
          null,
          4
        )}`
      )
  }
}

/**
 * look up region, treating out of index as false
 */
export const lookupRegion = (matrix: RegionMatrix, loc: MatrixLoc) => {
  try {
    const v = lookupMatrix(matrix, loc)
    if (!v) return true
  } catch (e) {
    if (e instanceof MatrixRangeError) {
      return false
    }
    throw e
  }
}

/**
 * check 8 direction
 */
export const lookAround = (matrix: RegionMatrix, loc: MatrixLoc) => {
  return (['t', 'r', 'b', 'l', 'tr', 'br', 'bl', 'tl'] as MatrixDirection[])
    .map((d) => lookupRegion(matrix, directionLoc(loc, d)))
    .filter((v) => v)
}

/**
 * reduce isolated region
 */
export const reduceNoise = (matrix: RegionMatrix, threshold = 1) => {
  const noises: MatrixLoc[] = []
  iterateMatrix(matrix, (x, y, val) => {
    if (val) {
      const around = lookAround(matrix, [x, y])
      if (around.length < threshold) {
        noises.push([x, y])
      }
    }
  })
  noises.forEach((noise) => swapMatrix(matrix, noise, false))
}
