
export type FrameFn = (frameCount: number) => void;

export const makeRenderer = (fps: number = 30) => {
  const frameInterval = 1000 / fps
  let lastFrameTime = 0
  let frameCount = 0

  const makeLoop = (frame: FrameFn) => {
    const fn = (currentTime: number): void => {
      const deltaTime = currentTime - lastFrameTime
      if (deltaTime >= frameInterval) {
        frameCount++
        lastFrameTime = currentTime
        frame(frameCount)
      }
      requestAnimationFrame(fn)
    }
    return fn
  }

  return  {
    start: (frame: FrameFn) => {
      const loop = makeLoop(frame)
      requestAnimationFrame(loop)
    },
    changeFPS: (newFps: number) => {
      fps = newFps
    }
  }
}
