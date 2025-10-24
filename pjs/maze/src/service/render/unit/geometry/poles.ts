import { GeometryCodeConverter, GeometryCodeGrid } from '../types.ts'
import { LogicalTerrainPattern } from '../../../../game/view/logicalView.ts'
import { buildInitialGrid, GLayer, GPosX, iterateGrid } from '../../../../integration/query'

export const convertToPoles: GeometryCodeConverter = (renderGrid) => {
  const codeGrid = buildInitialGrid<GeometryCodeGrid>(() => [])
  let stairPos: [GLayer, GPosX] | undefined

  iterateGrid((layer, pos) => {
    const pattern = renderGrid[layer][pos]
    if (pattern === LogicalTerrainPattern.FILL) {
      codeGrid[layer][pos].push('Pole')
    }
    if (pattern === LogicalTerrainPattern.STAIR_WARP) {
      codeGrid[layer][pos].push('Octahedron')
    }
    if (pattern === LogicalTerrainPattern.STAIR) {
      stairPos = [layer, pos]
    }
  })

  if (stairPos) {
    const [layer] = stairPos

    // replace layers with corridor
    for (let l = layer + 1; l < 6; l++) {
      codeGrid[l] = [['Pole'], [], ['Pole']]
    }
  }

  return { grid: codeGrid }
}
