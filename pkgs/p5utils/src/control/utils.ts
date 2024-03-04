export const makeDoubleTapBlocker = (blockMs = 10) => {
  let lastTappedTime: Date | undefined
  return {
    isNowSecondTap: (): boolean => {
      const now = new Date()
      if (lastTappedTime && timeDelta(lastTappedTime, now) < blockMs) {
        return true
      }
      lastTappedTime = now
      return false
    },
  }
}

function timeDelta(t1: Date, t2: Date): number {
  return Math.abs(t1.getTime() - t2.getTime())
}
