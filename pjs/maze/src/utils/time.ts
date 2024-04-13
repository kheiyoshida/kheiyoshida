export const trackTime = (() => {
  let startTime: Date
  return () => {
    if (!startTime) {
      startTime = new Date()
    }
    return convertMStoSeconds(new Date().getTime() - startTime.getTime())
  }
})()

const convertMStoSeconds = (ms: number) => {
  const secs = ms / 1000
  const minutes = zeroFill(Math.floor(secs / 60))
  const seconds = zeroFill((secs % 60).toFixed(0))
  return `${minutes}:${seconds}`
}

const zeroFill = (s: string|number) => ('0' + s).slice(-2)
