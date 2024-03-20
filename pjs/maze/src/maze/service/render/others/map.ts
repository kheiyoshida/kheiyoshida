import p5 from 'p5'
import { Position, loop2D } from 'utils'
import { Conf } from '../../../config'
import { NESW } from '../../../domain/maze/direction'
import { MapInfo } from '../../../domain/maze/mapper'
import { RenderPack } from '../vision'
import { getPalette } from '../vision/color/palette'

export const renderMap =
  ({ map }: RenderPack) =>
  () => {
    const mapSize = Math.min(Conf.ww, Conf.wh) * Conf.mapSizing
    const mapPosition: Position = [-mapSize / 2, -mapSize / 2]
    const pg = p.createGraphics(mapSize + 100, mapSize)
    drawMap(pg, map)
    pg.textSize(32)
    pg.text(`B${map.floor}F`, mapSize + 8, 32)
    p.image(pg, ...mapPosition)
  }

export const drawMap = (pg: p5.Graphics, { grid, current, direction }: MapInfo) => {
  const playerDir = NESW.indexOf(direction)
  const mapSize = pg.height

  const palette = getPalette()
  pg.fill(0, 200)
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
