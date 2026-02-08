import { TrackedFeature } from './feature'

export type Motion = {
  dx: number
  dy: number
}

function estimateMGlobalMotion(tracks: TrackedFeature[]): Motion {
  const dxs = tracks.map((f) => f.x1 - f.x0).filter(d => d!== 0)
  const dys = tracks.map((f) => f.y1 - f.y0).filter(d => d!== 0)

  return {
    dx: median(dxs),
    dy: median(dys),
  }
}

function median(xs: number[]) {
  if (xs.length === 0) return 0
  return xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)]
}

export type ResidualMotion = {
  x: number,
  y: number,
  rx: number,
  ry: number,
  strength: number,
}

export function getResiduals(tracks: TrackedFeature[]): ResidualMotion[] {
  const { dx: camDx, dy: camDy } = estimateMGlobalMotion(tracks)
  return tracks.map((f) => ({
    x: f.x0,
    y: f.y0,
    rx: f.x1 - f.x0 - camDx,
    ry: f.y1 - f.y0 - camDy,
    strength: f.strength,
  }))
}
