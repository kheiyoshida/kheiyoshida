import p5 from 'p5'
import { drawLineBetweenVectors2D } from 'p5utils/src/render/drawers/draw'
import { destVect } from 'p5utils/src/utils/p5utils'
import { randomFloatBetween as randomBetween } from 'utils'

export type Gene = {
  v: p5.Vector
  len: number
  width: number
  age: number
  angle: number
}

const __grow =
  (rootAngle: number, gene: Gene) =>
  (coefficient: number): Gene => {
    const dest = destVect(
      gene.v,
      gene.angle + coefficient,
      randomBetween(gene.len - 10, gene.len + 20)
    )
    return {
      ...gene,
      len: gene.age,
      v: dest,
      age: gene.age + 1,
      angle: restrainAngle(rootAngle, gene.angle) + coefficient,
    }
  }

export const restrainAngle = (rootAngle: number, angle: number) => {
  const thr = 30
  const base = rootAngle + angle
  if (base > thr && base < thr * 2) return base - thr
  else if (base > 270 + thr && base < 270 + thr * 2) return base + thr
  return base
}

const filter = (original: Gene, result: Gene[]): Gene[] => {
  const fate = Math.floor(randomBetween(1, original.age))
  if (fate >= 0 && fate < 15) return [result[0]]
  else if (fate >= 15 && fate < 30) return [result[1]]
  else if (fate >= 30 && fate < 50) return result
  else return []
}

const render = (original: Gene, result: Gene[]) => {
  result.forEach((r) => {
    drawLineBetweenVectors2D(original.v, r.v)
  })
}

export const grow = (rootAngle: number, gene: Gene): Gene[] => {
  if (gene.age > 55) return []
  const result = [+gene.width, -gene.width].map(__grow(rootAngle, gene))
  const filtered = filter(gene, result)
  render(gene, filtered)
  return filtered
}
