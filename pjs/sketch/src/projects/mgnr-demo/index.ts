import { applyConfig } from 'p5utils/src/utils/project'
import * as Tone from 'tone'
import { bindControl, bindRoutineControl } from './control'
import { restrictPosition } from './domain'
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
  bindControl(cameraStore)

  objectStore.lazyInit()
}

const draw = () => {
  const { roomVar } = variableStore.current

  bindRoutineControl(cameraStore)
  cameraStore.move()
  // updateAttitude(cameraStore.current.dir, variableStore)
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
