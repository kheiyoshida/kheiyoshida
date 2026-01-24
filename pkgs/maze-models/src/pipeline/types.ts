export type { Vector3D, TriangleIndexData, Index } from 'maze-gl'
import type { GeometrySpec as GS } from 'maze-gl'

export type GeometrySpec = GS & {
  meta?: {
    name?: string
    stage?: GeometryStage
  }
}

export type GeometryStage = 'base' | 'tessellated' | 'triangulated' | 'merged' | 'welded' | 'final'
