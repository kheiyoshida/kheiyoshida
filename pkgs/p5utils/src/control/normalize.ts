import { NormalizedInputValues, SwipeOrMouseMove, TouchOrMousePosition } from './types'

export const normalizeMouseInput = (mouse: TouchOrMousePosition, oneEquivalent = 1200) => {
  const center = getCenterPosition()
  return normalizeInputValues(mouse, center, oneEquivalent)
}

export const getCenterPosition = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

export const makeSwipeTracker = (oneEquivalent = 400) => {
  let swipeStarted: SwipeOrMouseMove | undefined
  return {
    get isSwipeHappening() {
      return swipeStarted ? true : false
    },
    startSwipe: (position: SwipeOrMouseMove) => {
      swipeStarted = position
    },
    getNormalizedValues: (currentPosition: SwipeOrMouseMove): NormalizedInputValues => {
      if (!swipeStarted) {
        throw Error(`swipe is not happening`)
      }
      return normalizeInputValues(currentPosition, swipeStarted, oneEquivalent)
    },
    endSwipe: () => {
      swipeStarted = undefined
    }
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
