import { Vector3D } from 'maze-gl'
import { TotalViewX, TotalViewZ, ViewPosition } from '../../../../integration/query/structure/view/view.ts'

export const MatrixLayerXSize = TotalViewX + 1 // 6
export const MatrixLayerZSize = TotalViewZ + 1 // 7

export type MatrixLayerPoints = Vector3D[][]

export type ScaffoldRect = {
  fl: Vector3D
  fr: Vector3D
  bl: Vector3D
  br: Vector3D
}

export class PointMatrixLayer {
  public readonly points: MatrixLayerPoints

  constructor(yValue: number, floorLength: number, pathLength: number) {
    const points: MatrixLayerPoints = []
    for (let z = 0; z < MatrixLayerZSize; z++) {
      const zValue = getZValue(z, floorLength, pathLength)
      const xValues = getXValues(floorLength, pathLength)
      const row: Vector3D[] = []
      for (let x = 0; x < MatrixLayerXSize; x++) {
        row.push([xValues[x], yValue, zValue])
      }
      points.push(row)
    }
    this.points = points
  }

  public getRect(viewPosition: Pick<ViewPosition, 'x' | 'z'>): ScaffoldRect {
    const front = viewPosition.z
    const back = viewPosition.z + 1
    const left = viewPosition.x + 2
    const right = viewPosition.x + 3
    return {
      fl: this.points[front][left],
      fr: this.points[front][right],
      bl: this.points[back][left],
      br: this.points[back][right],
    }
  }
}

const getZValue = (zIndex: number, floorLength: number, pathLength: number) => {
  const halfFloor = 0.5 * floorLength
  const floorPlusPathLength = Math.floor(zIndex / 2) * (floorLength + pathLength)
  const floorOnlyLength = (zIndex % 2) * floorLength
  const length = floorPlusPathLength + floorOnlyLength
  if (zIndex === 0) {
    return halfFloor - length
  }
  return halfFloor - length
}

const getXValues = (floorLength: number, pathLength: number) => [
  -floorLength / 2 - pathLength - floorLength,
  -floorLength / 2 - pathLength,
  -floorLength / 2,
  floorLength / 2,
  floorLength / 2 + pathLength,
  floorLength / 2 + pathLength + floorLength,
]
