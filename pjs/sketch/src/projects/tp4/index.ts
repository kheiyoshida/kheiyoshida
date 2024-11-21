import { requireMusic } from '../../assets'
import { callContext, createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/media/audio/types'
import { SketchConfigStore, applyConfig, instruction } from 'p5utils/src/utils/project'
import { makeStore } from 'utils'
import { cleanGraph, connectGraph, createGraph, growGraph, liveGraph, restrainGraph } from './graph'
import { Node } from './node'
import { renderGraph } from './render'
import { P5Canvas } from '../../lib/p5canvas'

const store = makeStore<
  SketchConfigStore & {
    nodes: Node[]
    furthest: number
    maxSpeed: number
  }
>()

const fftSize: FFTSize = 64
const soundSource = createSoundSource(requireMusic('tp4.mp3'))
const analyser = createAnalyzer(soundSource.source, fftSize)
const MAX_NODES = 300

const setup = () => {
  const maxSpeed = p.windowWidth > 1500 ? 30 : 30
  const graph = createGraph(analyser.bufferLength / 2, 30)
  store.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(10),
    strokeColor: p.color(255, 80),
    frameRate: 30,
    strokeWeight: 1,
    webgl: true,
    nodes: graph,
    furthest: p.windowWidth > 1500 ? 1200 : p.windowWidth * 2,
    maxSpeed,
  })
  applyConfig(store.read())
  connectGraph(graph, 0.2)

  const start = () => {
    const context = callContext()
    if (context.state === 'suspended') {
      context.resume()
    }
    soundSource.play()
  }

  p.mousePressed = start
  p.touchStarted = start
}

const draw = () => {
  // store
  const { fillColor, nodes, furthest, maxSpeed } = store.read()

  // position
  const m = p.millis() * 0.01
  p.rotateX(m * 0.01)
  p.rotateY(m * 0.01)

  // data
  const dataArray = analyser.analyze()
  liveGraph(nodes, dataArray, maxSpeed)
  restrainGraph(nodes, furthest, furthest * 0.6)
  store.update('nodes', (nodes) => cleanGraph(nodes, MAX_NODES))

  const highFreq = dataArray.slice(analyser.bufferLength / 2)
  const highFreqSum = highFreq.reduce((a, b) => a + b, 0)
  store.update('nodes', (nodes) =>
    growGraph(
      nodes,
      highFreq.map((d) => d * 20 - 10),
      highFreqSum / 2,
      analyser.bufferLength / 8
    )
  )

  // light.ts
  p.background(fillColor)
  p.directionalLight(p.color(200), p.createVector(0, 0, 800))
  renderGraph(nodes)
  p.camera(0, 0, 2000 + p.sin(m * 0.01) * 1000)
}

export default P5Canvas({
  setup,
  draw,
})
