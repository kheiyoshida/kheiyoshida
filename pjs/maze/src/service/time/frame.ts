export type FrameEventSpec = {
  frameInterval?: number
  handler: () => void
}

export type FrameEventId = string

export interface FrameConsumer {
  registerFrameEvent(eventId: FrameEventId, eventSpec: FrameEventSpec): void
  consumeFrame(frameCount: number): void
}

export const makeFrameConsumer = (): FrameConsumer => {
  const Events: Record<FrameEventId, FrameEventSpec> = {}

  return {
    registerFrameEvent(eventId, eventSpec) {
      validateInterval(eventSpec.frameInterval)
      Events[eventId] = eventSpec
    },
    consumeFrame(frameCount) {
      Object.values(Events).forEach(({ frameInterval: interval, handler }) => {
        if (interval === undefined || frameCount % interval === 0) {
          handler()
        }
      })
    },
  }
}
export const FrameConsumer = makeFrameConsumer()

const validateInterval = (interval: FrameEventSpec['frameInterval']) => {
  if (interval === undefined) return
  if (interval === 0) throw Error(`0 not allowed for interval`)
  if (!Number.isInteger(interval)) throw Error(`float is not allowed for interval`)
}
