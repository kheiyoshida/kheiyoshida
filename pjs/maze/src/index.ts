/* eslint-disable no-var */
import p5 from 'p5'
import maze from './maze'
import Logger from 'js-logger'

Logger.useDefaults()
Logger.setLevel(process.env.DEBUG ? Logger.DEBUG : Logger.WARN)

declare global {
  var p: p5

  type Sketch = {
    setup: () => void
    draw: () => void
    preload?: () => void
  }
}

const sketchFactory = (s: Sketch) => (p: p5) => {
  p.setup = () => s.setup()
  p.draw = () => s.draw()
  p.preload = s.preload || (() => {})
}

const canvas = document.getElementById('canvas')
if (!canvas) {
  throw Error('Canvas div not found')
}

global.p = new p5(sketchFactory(maze), canvas)
