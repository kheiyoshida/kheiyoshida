import { createCombination } from 'utils'
import { calcAverageVector } from '.'
import { drawLineBetweenVectors } from '../../render'
import { pushPop } from '../../render/utils'
import { extractNodeSurfaceVertices } from '../finalize/node'
import { calcNormal } from '../finalize/surface'
import { ShapeNode } from '../types'

export function drawLinesBetweenVertices({ vertices }: ShapeNode) {
  createCombination([...Array(vertices.length)].map((_, i) => i)).forEach(([i, j]) => {
    drawLineBetweenVectors(vertices[i], vertices[j])
  })
}

export function drawNormalsOfNode(node: ShapeNode) {
  const surfaces = extractNodeSurfaceVertices(node)
  surfaces.forEach(([surface, theOther]) => {
    const normal = calcNormal(surface, theOther)
    const center = calcAverageVector(surface)
    pushPop(() => {
      p.fill('red')
      p.translate(center)
      p.sphere(4, 4, 4)
    })
    pushPop(() => {
      p.stroke('red')
      drawLineBetweenVectors(center, center.copy().add(normal.copy().mult(100)))
    })
  })
}
