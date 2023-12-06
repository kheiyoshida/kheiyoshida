import { Conf } from "src/maze/config"

type RenderFn = () => void
type RenderQueue = RenderFn[]

/**
 * single queue thred to handle sequential render
 */
let queue: RenderQueue = []

/**
 * flag if it's waiting for queue to get empty
 */
let blocked = false

/**
 * consume render queue item.
 * queue can be replaced/pushed while consuming
 */
export const consume = () => {
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

export const push = (fn: RenderFn) => queue.push(fn)

export const update = (q: RenderQueue) => {
  queue = q
}

/**
 * wait until queue gets empty
 */
export const wait = (onQueueCleared: () => void) => {
  blocked = true
  _wait(onQueueCleared)
}

const _wait = (after: () => void) => {
  setTimeout(() => {
    if (!blocked) {
      after()
    } else {
      _wait(after)
    }
  }, Conf.frameInterval / 4)
}
