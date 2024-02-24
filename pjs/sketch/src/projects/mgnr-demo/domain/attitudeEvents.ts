import {
  EventThresholdFrameNumber1,
  EventThresholdFrameNumber2,
  EventThresholdFrameNumber3,
  EventThresholdFrameNumber4,
  EventThresholdFrameNumber5,
  LoudThreshold,
  SilentThreshold,
} from '../constants'
import { MusicCommands } from '../services/sound'
import { makeSketchStore } from '../state/sketch'
import { CommandGrid, Scenes, buildCommandGrid } from './commandGrid'

export const makeEventResolver =
  (commandGrid: CommandGrid, id?: string) => (roomVar: number, frames: number) => {
    handleThreshold('common')
    if (roomVar <= SilentThreshold) {
      handleThreshold('silent')
    } else if (roomVar >= LoudThreshold) {
      handleThreshold('loud')
    } else {
      handleThreshold('neutral')
    }
    function handleThreshold(scene: Scenes) {
      // console.log('handle', roomVar, frames)
      const sceneGrid = commandGrid[scene]
      if (frames === 0) return
      if (frames % EventThresholdFrameNumber1 === 0) {
        console.log(scene, id, 1)
        sceneGrid[1](roomVar)
      }
      if (frames % EventThresholdFrameNumber2 === 0) {
        console.log(scene, id, 2)
        sceneGrid[2](roomVar)
      }
      if (frames % EventThresholdFrameNumber3 === 0) {
        console.log(scene, id, 3)
        sceneGrid[3](roomVar)
      }
      if (frames % EventThresholdFrameNumber4 === 0) {
        console.log(scene, id, 4)
        sceneGrid[4](roomVar)
      }
      if (frames % EventThresholdFrameNumber5 === 0) {
        console.log(scene, id, 5)
        sceneGrid[5](roomVar)
      }
    }
  }

export const buildActiveCommandGrid = (
  m: MusicCommands,
  sketchStore: ReturnType<typeof makeSketchStore>
): CommandGrid =>
  buildCommandGrid({
    common: {
      1: () => {
        sketchStore.updateFillColor('brighten')
      },
      5: () => {
        m.startMod()
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
      4: () => {
        m.tomRandomize()
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
      4: () => {
        m.exSynRandomize()
      },
    },
  })

export const buildStillCommandGrid = (
  m: MusicCommands,
  sketchStore: ReturnType<typeof makeSketchStore>
): CommandGrid =>
  buildCommandGrid({
    common: {
      1: () => {
        sketchStore.updateFillColor('darken')
        m.startMod()
        m.exSynFadeIn()
      },
      5: () => {},
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
      4: () => {
        m.kickRandomize()
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
      4: () => {
        m.padRandomize()
      },
    },
  })
