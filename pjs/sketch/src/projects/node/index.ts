import { SketchConfigStore, applyConfig } from 'src/lib/utils/project'
import { makeStore } from 'src/lib/utils/store'

const store = makeStore<SketchConfigStore>()

const setup = () => {
  store.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(0, 80),
    strokeColor: p.color(255),
    frameRate: 10,
    strokeWeight: 1,
  })
  applyConfig(store.read())  
}

const draw = () => {
  const { cw, ch } = store.read()
  
}

export default <Sketch>{
  setup,
  draw,
}
