import { Transport } from 'tone'

export function scheduleRepeat(...args: Parameters<typeof Transport.scheduleRepeat>) {
  return Transport.scheduleRepeat(...args)
}

export function toSeconds(...args: Parameters<typeof Transport.toSeconds>) {
  return Transport.toSeconds(...args)
}

export function clear(...args: Parameters<typeof Transport.clear>) {
  return Transport.clear(...args)
}
