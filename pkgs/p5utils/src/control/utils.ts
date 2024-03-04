export const makeDoubleTapPreventer = () => {
  let lastTapped: Date = new Date()
  return {
    isSecondTapEvent: () => {
      const now = new Date()
      if (timeDelta(lastTapped, now) < 10) {
        return true
      }
      lastTapped = now
    },
  }
}

function timeDelta(t1: Date, t2: Date): number {
  return Math.abs(t1.getTime() - t2.getTime())
}
