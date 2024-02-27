import type p5 from 'p5'
import { useEffect, useRef, useState } from 'react'
import pj1 from 'sketch-components/src/projects/pj1'

import * as Tone from 'tone'

declare global {
  // eslint-disable-next-line no-var
  var p: p5

  type Sketch = {
    setup: () => void
    draw: () => void
    preload?: () => void
    windowResized?: () => void
  }
}

const DynamicP5Canvas = (sketch: Sketch) => () => {
  const [canvas, setCanvas] = useState<p5>()
  const canvasRef = useRef<HTMLDivElement>(null)

  let mount = false
  useEffect(() => {
    const loadP5 = async () => {
      const p5 = (await import('p5')).default
      if (canvasRef.current && !canvas) {
        if (!mount) {
          setCanvas(new p5(sketchFactory(sketch), canvasRef.current))
          mount = true
        }
      }
    }
    loadP5()
    return () => {
      canvas && canvas.remove()
    }
  }, [canvasRef])

  return <div ref={canvasRef} />
}

export const PJ1 = DynamicP5Canvas(pj1)
export const TonePJ = DynamicP5Canvas({
  setup: () => {
    p.createCanvas(100,100)
    p.background('white')
    const syn = new Tone.PolySynth().toDestination()
    Tone.Transport.scheduleRepeat(() => {
      syn.triggerAttackRelease(["Eb3", "G4", "Bb4", "D5"], [4, 3, 2, 1]);
    }, '4m')
    p.mouseClicked = () => {
      console.log('hey')
      Tone.Transport.start()
      Tone.start()
    }
  },
  draw: () => {},
})

const sketchFactory = (s: Sketch) => (p: p5) => {
  global.p = p
  p.setup = () => s.setup()
  p.draw = () => s.draw()
  p.preload = s.preload || (() => undefined)
}
