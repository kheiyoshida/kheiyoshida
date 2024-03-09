import { Conf } from '../../../maze/config'

type RenderFn = () => void
type RenderQueue = RenderFn[]

const makeRenderQueue = () => {
  let queue: RenderQueue = []
  let blocked = false
  const consume= () => {
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
  const update= (q: RenderQueue) => {
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
    }, Conf.frameInterval / 4)
  }
  return {
    consume,
    push,
    update,
    waitUntilQueueGetsEmpty,
  }
}

export const RenderQueue = makeRenderQueue()