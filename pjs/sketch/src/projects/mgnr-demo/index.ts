import p5 from 'p5'
import { applyConfig } from 'p5utils/src/utils/project'
import * as Tone from 'tone'
import { TreeRange } from './constants'
import { bindKeyEvent, bindTouchEvent } from './control/bindInput'
import { restrictPosition } from './domain'
import { updateAttitude } from './domain/attitude'
import {
  buildActiveCommandGrid,
  buildStillCommandGrid,
  makeEventResolver,
} from './domain/attitudeEvents'
import { generateTrees } from './services/objects'
import { music } from './sound'
import { cameraStore, sketchStore, variableStore } from './state'
import { showInstruction } from './ui'

// state
let geometries: p5.Geometry[]

// services
const musicCommands = music()
const startSound = () => {
  Tone.start()
  Tone.Transport.start()
}

// commands
const activeCommands = buildActiveCommandGrid(musicCommands, sketchStore)
const stillCommands = buildStillCommandGrid(musicCommands, sketchStore)
const onActive = makeEventResolver(activeCommands)
const onStill = makeEventResolver(stillCommands)

const setup = () => {
  showInstruction(startSound)

  sketchStore.lazyInit()
  applyConfig(sketchStore.current)
  p.noStroke()

  cameraStore.lazyInit()
  bindKeyEvent(cameraStore.updateDir)
  bindTouchEvent(cameraStore.updateDir)

  geometries = generateTrees(TreeRange, 40)
}

const draw = () => {
  const { roomVar } = variableStore.current

  cameraStore.move()
  updateAttitude(cameraStore.current.dir, variableStore)

  onActive(variableStore.current.roomVar, variableStore.current.active)
  onStill(variableStore.current.roomVar, variableStore.current.active)

  restrictPosition(cameraStore.current.camera, () => {
    variableStore.updateRoomVar()
    geometries = generateTrees(TreeRange, roomVar, roomVar)
    sketchStore.updateStrokeColor(roomVar)
  })

  const { fillColor, strokeColor } = sketchStore.current
  p.background(fillColor)
  p.lights()

  p.fill(strokeColor)
  geometries.forEach((geo) => {
    p.model(geo)
  })
}

export default <Sketch>{
  setup,
  draw,
}
