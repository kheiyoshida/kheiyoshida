import { NodeTerritory } from 'src/lib/data/node/types'
import { SketchConfigStore, applyConfig } from 'src/lib/utils/project'
import { makeStore } from 'src/lib/utils/store'
import { Graph, cleanGraph } from './graph'
import { live, move, seed } from './node'
import { render } from './render'

const store = makeStore<
  SketchConfigStore & {
    graph: Graph
    territory: NodeTerritory
  }
>()

const setup = () => {
  const [cw, ch] = [p.windowWidth, p.windowHeight]
  store.init({
    cw,
    ch,
    fillColor: p.color(20),
    strokeColor: p.color(200, 80),
    frameRate: 12,
    strokeWeight: 1,
    graph: [],
    territory: {
      l: 20,
      r: cw - 20,
      t: 20,
      b: ch - 20,
    },
  })
  applyConfig(store.read())
  p.angleMode(p.DEGREES)
  store.update(
    'graph',
    [...Array(3)].map(() => seed(cw / 2, ch / 2))
  )
}

const draw = () => {
  const { ch, cw, graph, territory } = store.read()

  p.rect(-1, -1, cw + 1, ch + 1)

  render(graph)

  graph.forEach((node) => move(node, territory))

  const newGraph = cleanGraph(graph.flatMap(live(territory)))
  store.update('graph', newGraph)
}

export default <Sketch>{
  setup,
  draw,
}
