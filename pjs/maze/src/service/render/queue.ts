export type RenderFn = () => void
export type RenderFnQueue = RenderFn[]

const makeRenderQueue = () => {
  let queue: RenderFnQueue = []
  const consume = () => {
    const renderFn = queue.shift()
    if (!renderFn) return
    renderFn()
  }
  const push = (...fns: RenderFn[]) => queue.push(...fns)
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

