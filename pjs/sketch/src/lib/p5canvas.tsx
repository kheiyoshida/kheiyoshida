import { useEffect, useRef, useState } from 'react'
import p5 from 'p5'
import { createPortal } from 'react-dom'

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

  return <div style={styles.canvasContainer} ref={canvasRef} />
}

const sketchFactory = (s: Sketch) => (p: p5) => {
  globalThis.p = p
  p.setup = () => s.setup()
  p.draw = () => s.draw()
  p.preload = s.preload || (() => undefined)
}

const styles: Record<string, React.CSSProperties> = {
  canvasContainer: {
    zIndex: 10,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: 'black',
    margin: '0 auto',
    touchAction: 'manipulation',
    overflowX: 'hidden',
    overflowY: 'hidden',
    overscrollBehavior: 'none'
  },
}
