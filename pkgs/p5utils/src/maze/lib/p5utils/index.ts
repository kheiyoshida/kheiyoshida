import p5 from 'p5'

export function gridPoint(unit = 100) {
  for (let i = 0; i <= p.width; i += unit) {
    for (let l = 0; l <= p.height; l += unit) {
      p.point(i, l)
    }
  }
}

export function translateByRadius(degree: number, radius: number) {
  const v = p5.Vector.fromAngle(p.radians(degree), radius)
  p.translate(v)
}

// eslint-disable-next-line
export function pushPop(cb: Function) {
  p.push()
  cb()
  p.pop()
}

export function destVect(v: p5.Vector, angle: number, len: number) {
  return v.copy().add(p5.Vector.fromAngle(p.radians(angle), len))
}

export function vline(v1: p5.Vector, v2: p5.Vector) {
  p.line(v1.x, v1.y, v2.x, v2.y)
}

export const pointLine = (p1: number[], p2: number[]) => {
  p.line(p1[0], p1[1], p2[0], p2[1])
}
