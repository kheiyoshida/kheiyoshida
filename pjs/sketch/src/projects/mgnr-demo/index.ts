import { applyConfig } from 'p5utils/src/utils/project'
import * as Tone from 'tone'
import { bindKeyEvent, bindTouchEvent } from './control/bindInput'
import { restrictPosition } from './domain'
import { updateAttitude } from './domain/attitude'
import {
  buildActiveCommandGrid,
  buildStillCommandGrid,
  makeEventResolver,
} from './domain/attitudeEvents'
import { music } from './services/sound'
import { showInstruction } from './services/ui'
import { cameraStore, objectStore, sketchStore, variableStore } from './state'

const musicCommands = music()
const startSound = () => {
  Tone.start()
  Tone.Transport.start()
}

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

  objectStore.lazyInit()
}

const draw = () => {
  const { roomVar } = variableStore.current

  cameraStore.move()
  updateAttitude(cameraStore.current.dir, variableStore)
  onActive(variableStore.current.roomVar, variableStore.current.active)
  onStill(variableStore.current.roomVar, variableStore.current.active)

  restrictPosition(cameraStore.current.camera, () => {
    variableStore.updateRoomVar()
    objectStore.renewTrees(roomVar)
    sketchStore.updateStrokeColor(roomVar)
  })

  // render
  const { fillColor, strokeColor } = sketchStore.current
  p.background(fillColor)
  p.lights()
  p.fill(strokeColor)
  objectStore.current.trees.forEach((tree) => {
    p.model(tree)
  })
}

export default <Sketch>{
  setup,
  draw,
}
