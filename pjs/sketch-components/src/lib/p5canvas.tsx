import { useEffect, useRef, useState } from 'react'
import p5 from 'p5'

export const P5Canvas = (sketch: Sketch) => () => {
  const [canvas, setCanvas] = useState<p5>()
  const canvasRef = useRef<HTMLDivElement>(null)

  let mount = false
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      if (!mount) {
        setCanvas(new p5(sketchFactory(sketch), canvasRef.current))
        mount = true
      }
    }
    return () => {
      canvas && canvas.remove()
    }
  }, [canvasRef])

  return <div ref={canvasRef} />
}

const sketchFactory = (s: Sketch) => (p: p5) => {
  globalThis.p = p
  p.setup = () => s.setup()
  p.draw = () => s.draw()
  p.preload = s.preload || (() => undefined)
}
