import { FrameInterval } from '../../config/frame'

export type RenderFn = () => void
export type RenderFnQueue = RenderFn[]

const makeRenderQueue = () => {
  let queue: RenderFnQueue = []
  let blocked = false
  const consume = () => {
    const fn = queue.shift()
    if (fn) {
      fn()
    } else {
      if (blocked) {
        blocked = false
      }
      return true
    }
  }
  const push = (fn: RenderFn) => queue.push(fn)
  const update = (q: RenderFnQueue) => {
    queue = q
  }
  const waitUntilQueueGetsEmpty = (onQueueCleared: () => void) => {
    blocked = true
    _wait(onQueueCleared)
  }
  const _wait = (onQueueCleared: () => void) => {
    setTimeout(() => {
      if (!blocked) {
        onQueueCleared()
      } else {
        _wait(onQueueCleared)
      }
    }, FrameInterval / 4)
  }
  return {
    consume,
    push,
    update,
    waitUntilQueueGetsEmpty,
  }
}

export const RenderQueue = makeRenderQueue()
