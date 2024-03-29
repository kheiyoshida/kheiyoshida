import type p5 from 'p5'

declare global {
  // eslint-disable-next-line no-var
  var p: p5

  type Sketch = {
    setup: () => void
    draw: () => void
    preload?: () => void
    windowResized?: () => void
  }
}
