import { SwipeOrMouseMove, TouchOrMousePosition } from './types'

export const detectMove = (): SwipeOrMouseMove => ({
  x: p.mouseX - p.pmouseX,
  y: p.mouseY - p.pmouseY,
})

export const detectPosition = (): TouchOrMousePosition => ({ x: p.mouseX, y: p.mouseY })
