import type p5 from 'p5'
import { useEffect, useRef, useState } from 'react'

export const Loading = () => {
  const [p5instance, setP5Instance] = useState<p5>()
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let removed = false
    async function setupP5() {
      if (canvasRef.current && !p5instance && !removed) {
        const P5 = await import('p5').then((imp) => imp.default)
        setP5Instance(new P5(sampleSketch(canvasRef.current), canvasRef.current))
      }
    }
    setupP5()
    return () => {
      removed = true
      p5instance && p5instance.remove()
    }
  }, [canvasRef, p5instance])

  return <div ref={canvasRef} style={{ width: '100%', aspectRatio: 1 }} />
}

const styleSheetTextColor = [201, 209, 217, 0.3 * 255] as const

const sampleSketch = (canvasContainer: HTMLDivElement | null) => (p: p5) => {
  let w = 0
  let h = 0
  if (canvasContainer) {
    w = canvasContainer.clientWidth
    h = canvasContainer.clientHeight
  }
  p.setup = () => {
    p.createCanvas(w, h)
    p.fill(...styleSheetTextColor)
    p.noStroke()
  }
  let points: [number, number][] = [...Array(h)].map(() => [0, randomInt(h)])
  const size = 2
  const delta = randomInt(10)
  p.draw = () => {
    points = points.map(([x, y]) => {
      p.rect(x, y, size, size)
      return [x > w ? 0 : x + size * delta, y + randomIntInRange(size)]
    })
  }
}

const randomInt = (max: number) => Math.floor(Math.random() * (max + 1))
const randomIntInRange = (range: number) => Math.floor(Math.random() * (2 * range + 1)) - range
