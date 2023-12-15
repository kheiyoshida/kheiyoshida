import { Transport } from 'tone'

export function scheduleLoop(
  cb: (time: number, loopNth: number) => void,
  durartion: number,
  startTime: number,
  numOfLoops: number
) {
  let loopNth = 0
  return Transport.scheduleRepeat(
    (time) => {
      loopNth += 1
      cb(time, loopNth)
    },
    durartion,
    startTime,
    durartion * numOfLoops
  )
}

export function scheduleRepeat(...args: Parameters<typeof Transport.scheduleRepeat>) {
  return Transport.scheduleRepeat(...args)
}

export function toSeconds(...args: Parameters<typeof Transport.toSeconds>) {
  return Transport.toSeconds(...args)
}

export function clear(...args: Parameters<typeof Transport.clear>) {
  return Transport.clear(...args)
}
