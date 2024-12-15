import { GeometryCodeConverter, GeometryCodeGrid } from '../types.ts'
import { buildInitialGrid, GLayer, GPosX, iterateGrid } from '../../../../domain/query'
import { RenderPattern } from '../../../../domain/query/structure/renderGrid/renderSpec.ts'

export const convertToTiles: GeometryCodeConverter = (renderGrid) => {
  const codeGrid = buildInitialGrid<GeometryCodeGrid>(() => [])
  let stairPos: [GLayer, GPosX] | undefined
  iterateGrid((layer, pos) => {
    const pattern = renderGrid[layer][pos]
    if (pattern === RenderPattern.FLOOR) {
      codeGrid[layer][pos] = ['Tile']
    } else if (pattern === RenderPattern.STAIR_WARP) {
      codeGrid[layer][pos] = ['Octahedron', 'Tile']
    } else if (pattern === RenderPattern.STAIR) {
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
