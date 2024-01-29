import { SketchConfigStore, applyConfig } from 'p5utils/src/utils/project'
import { makeStore } from 'utils'

const store = makeStore<SketchConfigStore>()

const setup = () => {
  store.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(20),
    strokeColor: p.color(255),
    frameRate: 10,
    strokeWeight: 1,
  })
  applyConfig(store.read())  
}

const draw = () => {
  const { cw, ch } = store.read()
  p.point(cw / 2, ch / 2)
  p.rect(-1, -1, cw + 1, ch + 1)
}

export default <Sketch>{
  setup,
  draw,
}
