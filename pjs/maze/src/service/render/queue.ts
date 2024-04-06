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
  return {
    get length() {
      return queue.length
    },
    consume,
    push,
    update,
  }
}

export const RenderQueue = makeRenderQueue()

export const registerIntervalRenderSequence = (renderFns: RenderFn[]) => {
  RenderQueue.update(renderFns)
}

export const reserveIntervalRender = (renderFns: RenderFn[]) => {
  renderFns.forEach(RenderQueue.push)
}
