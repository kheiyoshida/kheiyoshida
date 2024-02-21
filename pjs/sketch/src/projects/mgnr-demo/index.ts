import p5 from 'p5'
import { applyConfig } from 'p5utils/src/utils/project'
import * as Tone from 'tone'
import { FrameRate, SECONDS_TO_CHANGE_ATTITUDE, fieldRange, treeRange } from './constants'
import {
  buildActiveCommandGrid,
  buildStillCommandGrid,
  resolveEvents,
} from './control/attitudeEvents'
import { setupControl } from './control/control'
import { generateTrees } from './objects'
import { music } from './sound'
import { sketchStore, variableStore } from './state'
import { showInstruction } from './ui'

// state
let geometries: p5.Geometry[]

// services
const musicCommands = music()
const startSound = () => {
  Tone.start()
  Tone.Transport.start()
}
let control: ReturnType<typeof setupControl>

// commands
const activeCommands = buildActiveCommandGrid(musicCommands)
const stillCommands = buildStillCommandGrid(musicCommands)

const setup = () => {
  showInstruction(startSound)

  sketchStore.lazyInit()
  applyConfig(sketchStore.current)
  p.noStroke()

  geometries = generateTrees(treeRange, 40)
  control = setupControl(fieldRange, FrameRate * SECONDS_TO_CHANGE_ATTITUDE)
}

const draw = () => {
  const { active, still, roomVar } = variableStore.current
  console.log(active, still)
  control.move()
  control.detectAttitude({
    onActive: resolveEvents(roomVar, activeCommands, 'active'),
    onStill: resolveEvents(roomVar, stillCommands, 'still'),
  })
  control.restrictPosition(() => {
    variableStore.updateRoomVar()
    geometries = generateTrees(treeRange, roomVar, roomVar)
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
