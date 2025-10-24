import { RenderPack } from '../render/pack.ts'
import { NESW } from '../../core/grid/direction.ts'
import { loop2D } from 'utils'
import { getUIRenderer } from './renderer'
import {
  IsMobile,
  logicalCenterX,
  logicalCenterY,
  logicalHeight,
  logicalWidth,
  MaxFloorSize,
} from '../../config'

export const closeMap = () => {
  getUIRenderer().clearCanvas()
}

const maxNumOfCells = MaxFloorSize * 2 - 1
const cellSize = IsMobile ? 16 : 8
const mapSize = maxNumOfCells * cellSize

export const renderMap = ({ map: { grid, current, direction, floor } }: RenderPack) => {
  const renderer = getUIRenderer()
  const playerDir = NESW.indexOf(direction)

  const gridLength = grid.length

  renderer.changeFillColor([0, 0, 0.8])
  renderer.changeStrokeColor([0, 0, 0.0])

  // window
  renderer.drawRect({
    centerX: logicalCenterX,
    centerY: logicalCenterY,
    width: logicalWidth,
    height: logicalHeight,
    alpha: 0.5,
    temporaryFillColor: [0, 0, 0.5],
    omitStroke: true,
  })

  // map
  loop2D(gridLength, (i, j) => {
    const cell = grid[i][j]
    const offsetX = (j - gridLength / 2) * cellSize
    const offsetY = (i - gridLength / 2) * cellSize

    if (!cell) return
    if (!cell.visited && process.env.DEBUG !== 'true') return

    renderer.drawSquare({
      centerX: logicalCenterX + offsetX,
      centerY: logicalCenterY + offsetY,
      size: cellSize / 1.2,
      omitStroke: true,
    })

    if (process.env.DEBUG === 'true' && cell.stair) {
      renderer.drawCircle({
        centerX: logicalCenterX + offsetX,
        centerY: logicalCenterY + offsetY,
        size: cellSize/4,
        omitStroke: true,
        temporaryFillColor: [0, 1.0, 0.5],
      })
    }
  })

  // current position
  const [currentI, currentJ] = [current[0] * 2, current[1] * 2]

  renderer.drawTriangle({
    position: {
      x: logicalCenterX + (currentJ - gridLength / 2) * cellSize,
      y: logicalCenterY + (currentI - gridLength / 2) * cellSize,
    },
    points: [
      {
        x: 0,
        y: -cellSize / 2,
      },
      {
        x: cellSize / 2,
        y: cellSize / 2,
      },
      {
        x: -cellSize / 2,
        y: cellSize / 2,
      },
    ],
    rotation: (playerDir * Math.PI) / 2,
    temporaryFillColor: [0, 0.5, 0.5],
    omitStroke: true,
  })

  renderer.drawText({
    positionX: logicalCenterX - mapSize / 2,
    positionY: logicalCenterY - mapSize / 2 - cellSize,
    fontSize: cellSize * 1.2,
    text: `B${floor}F`,
  })
}
