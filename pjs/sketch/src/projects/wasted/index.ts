import { SketchConfigStore, applyConfig } from 'p5utils/src/lib/utils/project'
import { makeStoreV2 } from 'utils'

const store = makeStoreV2<SketchConfigStore>(() => ({
  cw: p.windowWidth,
  ch: p.windowHeight,
  fillColor: p.color(20),
  strokeColor: p.color(255),
  frameRate: 10,
  strokeWeight: 1,
}))({})

const setup = () => {
  store.lazyInit()
  applyConfig(store.current)
  p.angleMode(p.DEGREES)
}

const draw = () => {
  const { cw, ch } = store.current
  p.point(cw / 2, ch / 2)
  p.rect(-1, -1, cw + 1, ch + 1)
}

export default <Sketch>{
  setup,
  draw,
}
