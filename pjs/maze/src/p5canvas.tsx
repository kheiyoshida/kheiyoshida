import p5 from 'p5'
import { useEffect, useRef, useState } from 'react'

declare global {
  var p: p5 // eslint-disable-line
  var p2d: p5 // eslint-disable-line
}

type P5Context = 'p' | 'p2d'

type Sketch = {
  setup: () => void
  draw: () => void
}

export const P5Canvas = (sketch: Sketch, context: P5Context) => () => {
  const [canvas, setCanvas] = useState<p5>()
  const canvasRef = useRef<HTMLDivElement>(null)

  let mount = false
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      if (!mount) {
        setCanvas(new p5(sketchFactory(sketch, context), canvasRef.current))
        mount = true
      }
    }
    return () => {
      canvas && canvas.remove()
    }
  }, [canvasRef])

  return <div id={`canvas-${context}`} style={styles(context).canvasContainer} ref={canvasRef} />
}

const sketchFactory = (s: Sketch, context: P5Context) => (p: p5) => {
  globalThis[context] = p
  p.setup = () => s.setup()
  p.draw = () => s.draw()
}

const styles = (context: P5Context): Record<string, React.CSSProperties> => ({
  canvasContainer: {
    zIndex: context === 'p' ? 10 : 11,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: context === 'p' ? 'black' : 'transparent',
    margin: '0 auto',
    touchAction: 'manipulation',
    overflowX: 'hidden',
    overflowY: 'hidden',
    overscrollBehavior: 'none',
  },
})
