import { GeometryCodeConverter, GeometryCodeGrid } from '../types.ts'
import { RenderPattern } from '../../../../domain/query/structure/renderGrid/renderSpec.ts'
import { buildInitialGrid, GLayer, GPosX, iterateGrid } from '../../../../domain/query'

export const convertToPoles: GeometryCodeConverter = (renderGrid) => {
  const codeGrid = buildInitialGrid<GeometryCodeGrid>(() => [])
  let stairPos: [GLayer, GPosX] | undefined

  iterateGrid((layer, pos) => {
    const pattern = renderGrid[layer][pos]
    if (pattern === RenderPattern.FILL) {
      codeGrid[layer][pos].push('Pole')
    }
    if (pattern === RenderPattern.STAIR_WARP) {
      codeGrid[layer][pos].push('Octahedron')
    }
    if (pattern === RenderPattern.STAIR) {
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
