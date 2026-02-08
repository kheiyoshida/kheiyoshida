import { ResidualMotion } from './motion'

export type DepthEstimate = {
  x: number
  y: number
  z: number
}

export function estimateDepth(
  depthTileManager: DepthTileManager,
  motions: ResidualMotion[]
): DepthEstimate[] {
  const depthRaw = []
  let minParallax = Infinity
  let maxParallax = -Infinity
  for (let i = 0; i < motions.length; i++) {
    const motion = motions[i]
    const parallax = Math.sqrt(motion.rx * motion.rx + motion.ry * motion.ry)
    if (parallax < 0.2) continue
    depthRaw.push({ x: motion.x, y: motion.y, z: parallax })
    minParallax = Math.min(minParallax, parallax)
    maxParallax = Math.max(maxParallax, parallax)
  }

  // normalise depth
  const depths = []
  for (const d of depthRaw) {
    d.z = (d.z - minParallax) / (maxParallax - minParallax + 1e-6)
    depths.push(d)
  }

  // get tile depth
  depthTileManager.resetTiles()
  for (const d of depths) {
    depthTileManager.register(d)
  }

  return depthTileManager.getTileDepths()
}

export class DepthTileManager {
  private readonly tileX: number
  private readonly tileY: number

  private depthSums!: number[][][]

  constructor(
    private width: number,
    private height: number,
    private tileSize: number
  ) {
    this.tileX = width / tileSize
    this.tileY = height / tileSize

    if (Number.isNaN(this.tileX) || Number.isNaN(this.tileY)) {
      throw new Error('Invalid tile size')
    }

    this.resetTiles()
  }

  resetTiles() {
    this.depthSums = Array.from({ length: this.tileX }, () => Array.from({ length: this.tileY }, () => []))
  }

  register(depth: DepthEstimate) {
    const tx = Math.floor((depth.x - 1) / this.tileSize)
    const ty = Math.floor((depth.y - 1) / this.tileSize)
    this.depthSums[tx][ty].push(depth.z)
  }

  getTileDepths(): DepthEstimate[] {
    const result: DepthEstimate[] = []
    for (let tx = 0; tx < this.tileX - 1; tx++) {
      for (let ty = 0; ty < this.tileY - 1; ty++) {
        const values = this.depthSums[tx][ty]
        const sum = values.reduce((a, b) => a + b, 0)
        if (sum === 0) continue
        const depth = sum / values.length
        result.push({ x: tx * this.tileSize, y: ty * this.tileSize, z: depth })
      }
    }
    return result
  }
}
