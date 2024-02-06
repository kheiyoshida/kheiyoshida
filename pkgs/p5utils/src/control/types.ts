export type SwipeOrMouseMove = {
  x: number
  y: number
}

export type TouchOrMousePosition = {
  x: number
  y: number
}

export type ControlEventInfo = {
  move: SwipeOrMouseMove | null
  position: TouchOrMousePosition | null
}