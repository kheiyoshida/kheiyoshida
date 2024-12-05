import { PointSpec } from './renderer'
import { randomIntInAsymmetricRange } from 'utils'

export const makeMandala = () => {
  const grid: PointSpec[] = [
    {
      x: 0,
      y: 0,
    },
  ]

  return () => {
    if (grid.length > 3000) return grid
    const newPositions: PointSpec[] = []
    grid.forEach((point: PointSpec) => {
      const newPosition = {
        x: point.x + randomIntInAsymmetricRange(1),
        y: point.y + randomIntInAsymmetricRange(1),
      }
      newPositions.push(newPosition)
    })

    grid.push(...newPositions)
    return grid
  }
}
