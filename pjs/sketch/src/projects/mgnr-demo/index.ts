import p5 from 'p5'
import { moveColor } from 'src/lib/utils/p5utils'
import { applyConfig } from 'src/lib/utils/project'
import { randomIntBetween } from 'src/lib/utils/random'
import * as Tone from 'tone'
import { setupControl } from './control'
import { generateTrees } from './objects'
import { music } from './sound'
import { sketchConfigStore } from './state'
import { showInstruction } from './ui'

// constants
const fieldRange = 2000
const treeRange = fieldRange * 0.9
const frameRate = 30
const eventThresholdSeconds = 3
const eventThresholdSeconds2 = eventThresholdSeconds * 2
const eventThresholdSeconds3 = eventThresholdSeconds * 3
const silentThreshold = 20
const loudThreshold = 30
const SECONDS_TO_CHANGE_ATTITUDE = 2.5

// state
let geometries: p5.Geometry[]
let roomVar = 30

// services
const musicCommands = music()
const startSound = () => {
  Tone.start()
  Tone.Transport.start()
}
let control: ReturnType<typeof setupControl>

const setup = () => {
  showInstruction(startSound)
  sketchConfigStore.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(5),
    strokeColor: p.color(100, 200),
    frameRate,
    strokeWeight: 1,
    webgl: true,
  })
  applyConfig(sketchConfigStore.read())
  p.noStroke()
  geometries = generateTrees(treeRange, 40)
  control = setupControl(fieldRange, frameRate * SECONDS_TO_CHANGE_ATTITUDE)
}

const draw = () => {
  control.move()
  control.detectAttitude({
    onActive: (activeFrames) => {
      if (activeFrames === 0) return
      if (activeFrames % (eventThresholdSeconds * frameRate) === 0) {
        sketchConfigStore.update('fillColor', (c) => moveColor(c, 1, 1, 1, -1))
        if (roomVar > silentThreshold) {
          musicCommands.kickFadeOut()
        }
        if (roomVar < loudThreshold) {
          musicCommands.padFadeOut()
        }
      }
      if (activeFrames % (eventThresholdSeconds2 * frameRate) === 0) {
        if (roomVar > silentThreshold) {
          musicCommands.exSynFadeIn()
        }
        if (roomVar < loudThreshold) {
          musicCommands.tomFadeIn()
        }
      }
    },
    onStill: (stillFrames) => {
      if (stillFrames === 0) return
      if (stillFrames % (eventThresholdSeconds * frameRate) === 0) {
        sketchConfigStore.update('fillColor', (c) =>
          moveColor(c, -2, -2, -2, 2)
        )
        if (roomVar > silentThreshold) {
          musicCommands.exSynFadeOut()
        }
        if (roomVar < loudThreshold) {
          musicCommands.tomFadeOut()
        }
      }
      if (stillFrames % (eventThresholdSeconds2 * frameRate) === 0) {
        if (roomVar > silentThreshold) {
          musicCommands.padFadeIn()
        }
        if (roomVar < loudThreshold) {
          musicCommands.kickFadeIn()
        }
      }
      if (stillFrames % (eventThresholdSeconds3 * frameRate) === 0) {
        musicCommands.startMod()
      }
    },
  })
  control.restrictPosition(() => {
    roomVar = Math.max(5, Math.min(roomVar + randomIntBetween(-10, 10), 40))
    geometries = generateTrees(treeRange, roomVar, roomVar)
    sketchConfigStore.update('strokeColor', () =>
      p.color(
        randomIntBetween(0, roomVar * 3),
        randomIntBetween(0, roomVar * 3),
        randomIntBetween(0, roomVar * 3),
        200
      )
    )
  })

  const { fillColor, strokeColor } = sketchConfigStore.read()
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
