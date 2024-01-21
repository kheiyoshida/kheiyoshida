import p5 from 'p5'
import { restrain3D } from 'p5utils/src/lib/data/node/3d'
import * as NODE from 'p5utils/src/lib/data/node/index'
import { SketchConfigStore, applyConfig } from 'p5utils/src/lib/utils/project'
import { makeStore, randomIntInclusiveBetween } from 'utils'
import { createMidiInput } from '../../common/Input'
import { MidiNode3D, convertDurToSpeed, createNode, renderNode } from './node'

const store = makeStore<SketchConfigStore>()

const MIDIPortName = `Logic Pro Virtual Out`

const setup = async () => {
  store.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(20),
    strokeColor: p.color(255),
    frameRate: 30,
    strokeWeight: 1,
    webgl: true,
  })
  applyConfig(store.read())
  const input = await createMidiInput(MIDIPortName)
  input.addListener('noteon', ({ message: { dataBytes } }) => {
    handleIncomingMidiMessage({ midiNum: dataBytes[0], velocity: dataBytes[1] })
  })
}

type MidiNoteMessage = {
  midiNum: number
  velocity: number
}

const handleIncomingMidiMessage = ({ midiNum, velocity }: MidiNoteMessage) => {
  if (!nodes[midiNum]) addNewNode({ midiNum, velocity })
  else renewNodeSpeed({ midiNum, velocity })
}

const addNewNode = ({ midiNum, velocity }: MidiNoteMessage) => {
  nodes[midiNum] = createNode(
    p5.Vector.random3D().mult(300),
    {
      theta: randomIntInclusiveBetween(0, 360),
      phi: randomIntInclusiveBetween(0, 360),
    },
    velocity
  )
}

const renewNodeSpeed = ({ midiNum, velocity }: MidiNoteMessage) => {
  NODE.changeSpeed(nodes[midiNum], convertDurToSpeed(velocity))
}

const minSpeed = 5

const speedDown = (node: MidiNode3D) => {
  NODE.changeSpeed(node, (node) => {
    const moveSpeed = node.move.mag()
    return moveSpeed > minSpeed ? moveSpeed - 2 : minSpeed
  })
}

export type Nodes = { [midiNum: string]: MidiNode3D }
const nodes: Nodes = {}

const draw = () => {
  const { fillColor } = store.read()
  p.background(fillColor)
  p.orbitControl()
  p.lights()

  // pos
  const m = p.millis() * 0.01
  p.rotateX(m * 0.01)
  p.rotateY(m * 0.01)

  Object.values(nodes).forEach((node) => {
    NODE.move(node)
    speedDown(node)
    restrain3D(node, 500)
    renderNode(node)
  })

  p.camera(0, 0, 1000 + p.sin(m * 0.01) * 200)
}

export default <Sketch>{
  setup,
  draw,
}
