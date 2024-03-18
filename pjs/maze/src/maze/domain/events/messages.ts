import { VisionIntention, getVisionIntentionFromCurrentState } from '../vision'

export enum RenderSignal {
  CurrentView = 'CurrentView',
  Go = 'Go',
  TurnRight = 'TurnRight',
  TurnLeft = 'TurnLeft',
  GoDownStairs = 'GoDownStairs',
  ProceedToNextFloor = 'ProceedToNextFloor',
  OpenMap = 'OpenMap',
}

export type RenderMessage = [signal: RenderSignal, slice: VisionIntention]

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
  const consume = (cb: (message: RenderMessage) => void) => {
    // console.log(MessageQueue.map(q => q[0]))
    while (MessageQueue.length) {
      cb(_consume())
    }
  }
  return {
    push,
    consume,
  }
}

export const MessageQueue = createMessageQueue()
