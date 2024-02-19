import { NormalizedInputValues, SwipeOrMouseMove, TouchOrMousePosition } from './types'

export const normalizeMouseInput = (mouse: TouchOrMousePosition, oneEquivalent = 1200) => {
  const center = getCenterPosition()
  return normalizeInputValues(mouse, center, oneEquivalent)
}

export const getCenterPosition = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

export const makeSwipeTracker = (oneEquivalent = 400) => {
  let swipeStarted: SwipeOrMouseMove
  return {
    startSwipe: (position: SwipeOrMouseMove) => {
      swipeStarted = position
    },
    getNormalizedValues: (currentPosition: SwipeOrMouseMove): NormalizedInputValues => {
      return normalizeInputValues(currentPosition, swipeStarted, oneEquivalent)
    },
  }
}

export const normalizeInputValues = (
  current: TouchOrMousePosition,
  zeroPosition: TouchOrMousePosition,
  oneEquivalentDistance: number
): NormalizedInputValues => ({
  x: (current.x - zeroPosition.x) / oneEquivalentDistance,
  y: (current.y - zeroPosition.y) / oneEquivalentDistance,
})
