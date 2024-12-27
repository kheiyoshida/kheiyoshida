import { GeometryCodeConverter, GeometryCodeGrid } from '../types.ts'
import { buildInitialGrid, GLayer, GPosX, iterateGrid } from '../../../../domain/query'
import { LogicalTerrainPattern } from '../../../../domain/entities/view/logicalView.ts'

export const convertToTiles: GeometryCodeConverter = (renderGrid) => {
  const codeGrid = buildInitialGrid<GeometryCodeGrid>(() => [])
  let stairPos: [GLayer, GPosX] | undefined
  iterateGrid((layer, pos) => {
    const pattern = renderGrid[layer][pos]
    if (pattern === LogicalTerrainPattern.FLOOR) {
      codeGrid[layer][pos] = ['Tile']
    } else if (pattern === LogicalTerrainPattern.STAIR_WARP) {
      codeGrid[layer][pos] = ['Octahedron', 'Tile']
    } else if (pattern === LogicalTerrainPattern.STAIR) {
      stairPos = [layer, pos]
      if (layer !== GLayer.L0) {
        codeGrid[layer][pos] = ['StairTile']
      }
    }
  })

  if (!stairPos) return { grid: codeGrid }

  const altGrid = buildInitialGrid<GeometryCodeGrid>(() => [])
  const [layer] = stairPos

  for (let l = layer; l < 6; l++) {
    altGrid[l] = [[], ['LowerTile'], []]
  }

  if (layer === GLayer.L0) {
    altGrid[GLayer.L5] = [['LowerTile'], ['LowerTile'], ['LowerTile']]
  }

  return {
    grid: codeGrid,
    altGrid: [
      {
        grid: altGrid,
      },
    ],
  }
}
