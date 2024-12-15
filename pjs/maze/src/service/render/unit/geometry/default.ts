import { buildInitialGrid, GPosX, iterateGrid } from '../../../../domain/query'
import { GeometryCode, GeometryCodeConverter, GeometryCodeGrid } from '../types.ts'
import { RenderPattern } from '../../../../domain/query/structure/renderGrid/renderSpec.ts'

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

const convertCenter = (pattern: RenderPattern): GeometryCode[] => {
  if (pattern === RenderPattern.STAIR)
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
  if (pattern === RenderPattern.STAIR_WARP)
    return ['Octahedron', 'Floor', 'Ceil']
  if (pattern === RenderPattern.FLOOR) return ['Floor', 'Ceil']
  if (pattern === RenderPattern.FILL) return ['FrontWall']
  throw Error()
}

const convertSide = (pattern: RenderPattern, position: GPosX): GeometryCode[] => {
  if (pattern === RenderPattern.FLOOR) return ['Floor', 'Ceil']
  if (pattern === RenderPattern.FILL) {
    if (position === GPosX.LEFT) return ['FrontWall', 'LeftWall']
    if (position === GPosX.RIGHT) return ['FrontWall', 'RightWall']
  }
  throw Error()
}
