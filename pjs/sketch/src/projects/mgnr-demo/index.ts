import { applyConfig } from 'p5utils/src/utils/project'
import * as Tone from 'tone'
import { VisibleRange } from './constants'
import { bindControl, bindRoutineControl } from './control'
import { updateAttitude } from './domain/attitude'
import {
  buildActiveCommandGrid,
  buildStillCommandGrid,
  makeEventResolver,
} from './domain/attitudeEvents'
import { cameraReachedEdgeEvent } from './domain/field'
import { renderGeometryObject } from './services/objects/object'
import { music } from './services/sound'
import { showInstruction } from './services/ui'
import { cameraStore, objectStore, sketchStore, variableStore } from './state'
import { fireByRate } from 'utils'

const musicCommands = music()
const startSound = () => {
  Tone.start()
  Tone.Transport.start()
}

const activeCommands = buildActiveCommandGrid(musicCommands, sketchStore)
const stillCommands = buildStillCommandGrid(musicCommands, sketchStore)
const onActive = makeEventResolver(activeCommands, 'active')
const onStill = makeEventResolver(stillCommands, 'still')

const setup = () => {
  showInstruction(startSound)

  sketchStore.lazyInit()
  applyConfig(sketchStore.current)
  p.noStroke()
  p.angleMode(p.DEGREES)
  p.textureMode(p.NORMAL)

  cameraStore.lazyInit()
  bindControl(cameraStore)

  objectStore.lazyInit()

  p.perspective(60, p.width / p.height, 10, VisibleRange)
}

const draw = () => {
  bindRoutineControl(cameraStore)
  cameraStore.move()
  updateAttitude(cameraStore.current.dirs, variableStore)
  onActive(variableStore.current.roomVar, variableStore.current.active)
  onStill(variableStore.current.roomVar, variableStore.current.still)

  cameraReachedEdgeEvent(cameraStore.current.camera, variableStore, objectStore)



  // render
  const { fillColor } = sketchStore.current
  p.background(fillColor)
  p.lights()
  p.pointLight(100, 100, 100, ...cameraStore.current.camera.position)

  if (fireByRate(0.5)) {
    objectStore.renewSkin()
  }
  p.texture(objectStore.current.skin)
  objectStore.current.trees.forEach(
    renderGeometryObject
  )
}

export default <Sketch>{
  setup,
  draw,
}
