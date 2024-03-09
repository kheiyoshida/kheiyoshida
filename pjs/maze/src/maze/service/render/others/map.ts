import { pushPop } from 'p5utils/src/render'
import { loop2D } from 'utils'
import { Conf } from '../../../config'
import { NESW } from '../../../domain/maze/direction'
import { Vision } from '../vision'

export const renderMap =
  ({ map: { grid, current, direction, floor } }: Vision) =>
  () => {
    const [currentI, currentJ] = [current[0] * 2, current[1] * 2]
    const playerDir = NESW.indexOf(direction)

    // determine position
    const mapSize = Math.min(Conf.ww, Conf.wh) * Conf.mapSizing
    const mapPosition = [(Conf.ww - mapSize) / 2, (Conf.wh - mapSize) / 2]

    // show floor on the left top
    p.text(`B${floor}F`, mapPosition[0], mapPosition[1])

    // background
    p.rect(mapPosition[0], mapPosition[1], mapSize)

    // calc sizings
    const gridLength = grid.length
    const { sizeAvg, nodeSize, edgeSize } = calcMapSizings(mapSize, gridLength)

    const drawGrid = (posX: number, posY: number, w: number, h: number) => {
      p.rect(mapPosition[0] + posX, mapPosition[1] + posY, w, h)
    }

    p.push()
    p.noStroke()
    p.fill(100, 200)

    // map
    loop2D(gridLength, (i, j) => {
      const cell = grid[i][j]
      if (!cell) return
      const [iEven, jEven] = [i % 2 === 0, j % 2 === 0]
      // node
      if (iEven && jEven) {
        drawGrid(sizeAvg * j, sizeAvg * i, nodeSize, nodeSize)
      }
      // edge
      else {
        if (!jEven) {
          drawGrid(sizeAvg * (j - 1) + nodeSize, sizeAvg * i, edgeSize, nodeSize)
        } else {
          drawGrid(sizeAvg * j, sizeAvg * (i - 1) + nodeSize, nodeSize, edgeSize)
        }
      }
    })
    p.pop()

    // current position
    pushPop(() => {
      p.fill(255)
      p.translate(
        mapPosition[0] + sizeAvg * currentJ + nodeSize / 2,
        mapPosition[1] + sizeAvg * currentI + nodeSize / 2
      )
      p.rotate(playerDir * p.HALF_PI)
      p.triangle(0, -nodeSize / 2, nodeSize / 2, nodeSize / 2, -nodeSize / 2, nodeSize / 2)
    })
  }

export function calcMapSizings(mapSize: number, gridLength: number) {
  const sizeRatio = 1.44
  const nodeSize = (2 * mapSize) / ((1 + sizeRatio) * gridLength + (1 - sizeRatio))
  const edgeSize = sizeRatio * nodeSize
  const sizeAvg = (nodeSize + edgeSize) / 2
  return { sizeAvg, nodeSize, edgeSize }
}
