import { buildInitialGrid, GPosX, iterateGrid } from '../../../index.ts'
import { GeometryCode, GeometryCodeConverter, GeometryCodeGrid } from '../types.ts'
import { LogicalTerrainPattern } from '../../../../../game/view/logicalView.ts'

export const convertToClassicGeometryCodes: GeometryCodeConverter = (renderGrid) => {
  const modelGrid = buildInitialGrid<GeometryCodeGrid>(() => [])

  iterateGrid((layer, pos) => {
    const pattern = renderGrid[layer][pos]
    if (pattern === null) return
    if (pos === GPosX.CENTER) {
      modelGrid[layer][pos] = convertCenter(pattern)
    } else {
      modelGrid[layer][pos] = convertSide(pattern, pos)
    }
  })

  return { grid: modelGrid }
}

const convertCenter = (pattern: LogicalTerrainPattern): GeometryCode[] => {
  if (pattern === LogicalTerrainPattern.STAIR)
    return [
      'StairCeil',
      'StairSteps',
      'StairRightWall',
      'StairLeftWall',
      'StairCorridorRightWall',
      'StairCorridorLeftWall',
      'StairCorridorCeil',
      'StairCorridorFloor',
    ]
  if (pattern === LogicalTerrainPattern.STAIR_WARP)
    return ['Octahedron', 'Floor', 'Ceil']
  if (pattern === LogicalTerrainPattern.FLOOR) return ['Floor', 'Ceil']
  if (pattern === LogicalTerrainPattern.FILL) return ['FrontWall']
  throw Error()
}

const convertSide = (pattern: LogicalTerrainPattern, position: GPosX): GeometryCode[] => {
  if (pattern === LogicalTerrainPattern.FLOOR) return ['Floor', 'Ceil']
  if (pattern === LogicalTerrainPattern.FILL) {
    if (position === GPosX.LEFT) return ['FrontWall', 'LeftWall']
    if (position === GPosX.RIGHT) return ['FrontWall', 'RightWall']
  }
  throw Error()
}
