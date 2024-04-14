export type DrawFrame = () => void
export type DrawFnArray = DrawFrame[]

const makeRenderQueue = () => {
  let queue: DrawFnArray = []
  const consume = () => {
    const renderFn = queue.shift()
    if (!renderFn) return
    renderFn()
  }
  const push = (...fns: DrawFrame[]) => queue.push(...fns)
  const update = (q: DrawFnArray) => {
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
