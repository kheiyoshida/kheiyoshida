import { moveColor } from 'src/lib/utils/p5utils'
import {
  EventThresholdFrameNumber1,
  EventThresholdFrameNumber2,
  EventThresholdFrameNumber3,
  LoudThreshold,
  SilentThreshold,
} from '../constants'
import { music } from '../sound'
import { sketchConfigStore } from '../state'
import { buildCommandGrid, CommandGrid, Scenes } from './commandGrid'

export const resolveEvents =
  (roomVar: number, commandGrid: CommandGrid, id?: string) => (frames: number) => {
    handleThreshold('common')
    if (roomVar <= SilentThreshold) {
      handleThreshold('silent')
    } else if (roomVar >= LoudThreshold) {
      handleThreshold('loud')
    } else {
      handleThreshold('neutral')
    }
    function handleThreshold(scene: Scenes) {
      const sceneGrid = commandGrid[scene]
      if (frames === 0) return
      if (frames % EventThresholdFrameNumber1 === 0) {
        console.log(id, scene, 1)
        sceneGrid[1](roomVar)
      }
      if (frames % EventThresholdFrameNumber2 === 0) {
        console.log(id, scene, 2)
        sceneGrid[2](roomVar)
      }
      if (frames % EventThresholdFrameNumber3 === 0) {
        console.log(id, scene, 3)
        sceneGrid[3](roomVar)
      }
    }
  }

export const buildActiveCommandGrid = (m: ReturnType<typeof music>): CommandGrid =>
  buildCommandGrid({
    common: {
      1: () => {
        sketchConfigStore.update('fillColor', (c) => moveColor(c, 1, 1, 1, -1))
      },
    },
    neutral: {
      1: () => {
        m.padFadeOut()
        m.kickFadeOut()
      },
      2: () => {
        m.exSynFadeIn()
        m.tomFadeIn()
      },
    },
    silent: {
      1: () => {
        m.kickFadeOut()
      },
      2: () => {
        m.tomFadeIn()
        m.padFadeOut()
      },
      3: () => {
        m.exSynFadeIn()
      },
    },
    loud: {
      1: () => {
        m.padFadeOut()
      },
      2: () => {
        m.exSynFadeIn()
        m.kickFadeOut()
      },
      3: () => {
        m.tomFadeIn()
      },
    },
  })

export const buildStillCommandGrid = (m: ReturnType<typeof music>): CommandGrid =>
  buildCommandGrid({
    common: {
      1: () => {
        sketchConfigStore.update('fillColor', (c) => moveColor(c, -2, -2, -2, 2))
      },
      2: () => {
        m.tomFadeOut()
      },
    },
    neutral: {
      1: () => {
        m.exSynFadeOut()
        m.tomFadeOut()
      },
      2: () => {
        m.padFadeIn()
        m.kickFadeIn()
      },
    },
    silent: {
      1: () => {
        m.tomFadeOut()
      },
      2: () => {
        m.kickFadeIn()
        m.exSynFadeOut()
      },
      3: () => {
        m.padFadeIn()
      },
    },
    loud: {
      1: () => {
        m.exSynFadeOut()
      },
      2: () => {
        m.padFadeIn()
        m.tomFadeOut()
      },
      3: () => {
        m.kickFadeIn()
      },
    },
  })
