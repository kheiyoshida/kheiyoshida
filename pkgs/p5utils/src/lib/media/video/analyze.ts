import { createEmptyMatrix } from '../../data/matrix/matrix'
import { RGBA, RGBAMatrix } from '../../data/matrix/types'

export const brightness = ([r, g, b]: RGBA) => (299 * r + 587 * g + 114 * b) / 1000

export const compareBrightness = (rgba1: RGBA, rgba2: RGBA) =>
  Math.abs(brightness(rgba1) - brightness(rgba2))

export const analyzeContrast = (matrix: RGBAMatrix, threshold: number) => {
  const contrastMatrix = createEmptyMatrix<number>(matrix[0].length, matrix.length)
  matrix.forEach((row, y) => {
    row.forEach((rgba, x) => {
      if (x !== 0) {
        const d = compareBrightness(rgba, matrix[y][x - 1])
        if (d > threshold) {
          contrastMatrix[y][x - 1] = d
        }
      }
    })

    row.forEach((rgba, x) => {
      if (matrix[y + 1]) {
        const d = compareBrightness(rgba, matrix[y + 1][x])
        if (d > threshold) {
          contrastMatrix[y + 1][x] = d
        }
      }
    })
  })
  return contrastMatrix
}
