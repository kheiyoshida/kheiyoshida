import p5 from 'p5'
import { Position, loop2D } from 'utils'
import { Conf } from '../../../config'
import { NESW } from '../../../domain/maze/direction'
import { MapInfo } from '../../../domain/maze/mapper'
import { Vision } from '../vision'
import { getPalette } from '../vision/color/palette'

export const renderMap =
  ({ map }: Vision) =>
  () => {
    const mapSize = Math.min(Conf.ww, Conf.wh) * Conf.mapSizing
    const mapPosition: Position = [(Conf.ww - mapSize) / 2, (Conf.wh - mapSize) / 2]
    renderFloor(mapPosition, map.floor)
    const pg = p.createGraphics(mapSize, mapSize)
    drawMap(pg, map)
    p.image(pg, ...mapPosition)
  }

const renderFloor = (position: Position, floor: number) => {
  p.text(`B${floor}F`, ...position)
}

export const drawMap = (pg: p5.Graphics, { grid, current, direction }: MapInfo) => {
  const playerDir = NESW.indexOf(direction)
  const mapSize = pg.width

  const palette = getPalette()
  pg.fill(palette.fill)
  pg.stroke(palette.stroke)
  pg.rect(0, 0, mapSize, mapSize)

  // calc sizings
  const gridLength = grid.length
  const { sizeAvg, nodeSize, edgeSize } = calcMapSizings(mapSize, gridLength)

  pg.push()
  pg.noStroke()
  pg.fill(100, 200)

  // map
  loop2D(gridLength, (i, j) => {
    const cell = grid[i][j]
    if (!cell || !cell.visited) return
    const [iEven, jEven] = [i % 2 === 0, j % 2 === 0]
    // node
    if (iEven && jEven) {
      pg.rect(sizeAvg * j, sizeAvg * i, nodeSize, nodeSize)
    }
    // edge
    else {
      if (!jEven) {
        pg.rect(sizeAvg * (j - 1) + nodeSize, sizeAvg * i, edgeSize, nodeSize)
      } else {
        pg.rect(sizeAvg * j, sizeAvg * (i - 1) + nodeSize, nodeSize, edgeSize)
      }
    }
  })
  pg.pop()

  // current position
  const [currentI, currentJ] = [current[0] * 2, current[1] * 2]
  pg.push()
  pg.fill(255)
  pg.translate(sizeAvg * currentJ + nodeSize / 2, sizeAvg * currentI + nodeSize / 2)
  pg.rotate(playerDir * pg.HALF_PI)
  pg.triangle(0, -nodeSize / 2, nodeSize / 2, nodeSize / 2, -nodeSize / 2, nodeSize / 2)
  pg.pop()
}

export function calcMapSizings(mapSize: number, gridLength: number, sizeRatio = 1.44) {
  // if nodes are 6, edges are 5 in total.
  // total number of unit (the rendered size of node) is:
  const totalUnitNum = (1 + sizeRatio) * gridLength - (sizeRatio - 1)
  const nodeSize = (2 * mapSize) / totalUnitNum
  const edgeSize = sizeRatio * nodeSize
  const sizeAvg = (nodeSize + edgeSize) / 2
  return { sizeAvg, nodeSize, edgeSize }
}
