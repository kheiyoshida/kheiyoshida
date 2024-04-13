import { loop2D } from 'utils'
import { mapSizing, wh, ww } from '../../config'
import { NESW } from '../../domain/interface/maze/direction'
import { MapInfo } from 'src/domain/interface/mapper'
import { RenderPack } from '../render/pack'

const mapSize = Math.floor(Math.min(ww, wh) * mapSizing)
const positionX = Math.floor((ww - mapSize) / 2)
const positionY = Math.floor((wh - mapSize) / 2)

export const Map = () => {
  return (
    <div
      id="map-canvas-container"
      style={{
        width: mapSize,
        height: mapSize,
        position: 'fixed',
        top: positionY,
        left: positionX,
        visibility: 'hidden',
      }}
    >
      <div id="map-floor" style={{ color: 'white' }}></div>
      <canvas id="map-canvas" width={mapSize} height={mapSize}></canvas>
    </div>
  )
}

const getMapCanvasContainer = () => {
  const container = document.getElementById('map-canvas-container')
  if (!container) throw Error(`could not find map canvas container`)
  return container as HTMLDivElement
}

export const closeMap = () => {
  getMapCanvasContainer().style.visibility = 'hidden'
}

export const renderMap = ({ map }: RenderPack) => {
  getMapCanvasContainer().style.visibility = 'visible'
  drawMap(map)
  document.getElementById('map-floor')!.innerHTML = `floor: B${map.floor}`
}

const drawMap = ({ grid, current, direction }: MapInfo) => {
  const ctx = getMapCanvasCtx()
  const playerDir = NESW.indexOf(direction)

  ctx.fillStyle = 'rgb(0 0 0)'
  ctx.strokeStyle = 'rgb(255 255 255)'
  ctx.clearRect(0, 0, mapSize, mapSize)
  ctx.fillRect(0, 0, mapSize, mapSize)
  ctx.strokeRect(0, 0, mapSize, mapSize)

  const gridLength = grid.length
  const { sizeAvg, nodeSize, edgeSize } = calcMapSizings(mapSize, gridLength)

  ctx.fillStyle = 'rgb(100 100 100)'

  // map
  loop2D(gridLength, (i, j) => {
    const cell = grid[i][j]
    if (!cell || !cell.visited) return
    const [iEven, jEven] = [i % 2 === 0, j % 2 === 0]
    // node
    if (iEven && jEven) {
      ctx.clearRect(sizeAvg * j, sizeAvg * i, nodeSize, nodeSize)
      ctx.fillRect(sizeAvg * j, sizeAvg * i, nodeSize, nodeSize)
    }
    // edge
    else {
      if (!jEven) {
        ctx.fillRect(sizeAvg * (j - 1) + nodeSize, sizeAvg * i, edgeSize, nodeSize)
      } else {
        ctx.fillRect(sizeAvg * j, sizeAvg * (i - 1) + nodeSize, nodeSize, edgeSize)
      }
    }
  })

  // current position
  const [currentI, currentJ] = [current[0] * 2, current[1] * 2]
  ctx.fillStyle = 'rgb(255 255 255)'
  ctx.translate(sizeAvg * currentJ + nodeSize / 2, sizeAvg * currentI + nodeSize / 2)
  ctx.rotate((playerDir * Math.PI) / 2)
  ctx.beginPath()
  ctx.moveTo(0, -nodeSize / 2)
  ctx.lineTo(nodeSize / 2, nodeSize / 2)
  ctx.lineTo(-nodeSize / 2, nodeSize / 2)
  ctx.fill()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
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

const getMapCanvasCtx = () => {
  const canvas = document.getElementById('map-canvas') as HTMLCanvasElement
  if (!canvas) throw Error(`could not find map canvas`)
  if (!canvas.getContext) throw Error(`canvas.getContext not supported`)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw Error(`ctx is null`)
  return ctx
}
