import { DomainIntention, getVisionIntentionFromCurrentState } from '..'

export enum RenderSignal {
  CurrentView = 'CurrentView',
  Go = 'Go',
  TurnRight = 'TurnRight',
  TurnLeft = 'TurnLeft',
  GoDownStairs = 'GoDownStairs',
  ProceedToNextFloor = 'ProceedToNextFloor',
  OpenMap = 'OpenMap',
  CloseMap = 'CloseMap',
}

export type RenderMessage = [signal: RenderSignal, intention: DomainIntention]

const createMessageQueue = () => {
  const MessageQueue: RenderMessage[] = []
  const push = (signal: RenderSignal) => {
    MessageQueue.push([signal, getVisionIntentionFromCurrentState()])
  }
  const _consume = (): RenderMessage => {
    const message = MessageQueue.shift()
    if (message) return message
    throw Error(`message queue is empty`)
  }
  const resolve = (cb: (message: RenderMessage) => void) => {
    while (MessageQueue.length) {
      cb(_consume())
    }
  }
  return {
    get debug() {
      return MessageQueue.map((m) => m[0])
    },
    get isEmpty() {
      return MessageQueue.length === 0
    },
    push,
    resolve,
  }
}

export const MessageQueue = createMessageQueue()
