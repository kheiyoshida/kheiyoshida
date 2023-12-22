import { moveColor } from 'src/lib/utils/p5utils'
import {
  EventThresholdFrameNumber1,
  EventThresholdFrameNumber2,
  EventThresholdFrameNumber3,
  eventThresholdSeconds,
  eventThresholdSeconds2,
  eventThresholdSeconds3,
  FrameRate,
  LoudThreshold,
  SilentThreshold,
} from '../constants'
import { sketchConfigStore } from '../state'
import { music } from '../sound'
import { CommandGrid, Thresholds } from './commandGrid'

export const resolveEvents = (roomVar: number, commandGrid: CommandGrid) => (frames: number) => {
  if (frames === 0) return
  if (frames % EventThresholdFrameNumber1 === 0) {
    handleThreshold(1)
  }
  if (frames % EventThresholdFrameNumber2 === 0) {
    handleThreshold(2)
  }
  if (frames % EventThresholdFrameNumber3 === 0) {
    handleThreshold(3)
  }
  function handleThreshold(th: Thresholds) {
    const thGrid = commandGrid[th]
    thGrid.common(roomVar)
    if (roomVar <= SilentThreshold) {
      thGrid.silent(roomVar)
    } else if (roomVar >= LoudThreshold) {
      thGrid.loud(roomVar)
    } else {
      thGrid.neutral(roomVar)
    }
  }
}

export const onActive =
  (roomVar: number, musicCommands: ReturnType<typeof music>) => (activeFrames: number) => {
    if (activeFrames === 0) return
    if (activeFrames % (eventThresholdSeconds * FrameRate) === 0) {
      sketchConfigStore.update('fillColor', (c) => moveColor(c, 1, 1, 1, -1))
      if (roomVar > SilentThreshold) {
        musicCommands.kickFadeOut()
      }
      if (roomVar < LoudThreshold) {
        musicCommands.padFadeOut()
      }
    }
    if (activeFrames % (eventThresholdSeconds2 * FrameRate) === 0) {
      if (roomVar > SilentThreshold) {
        musicCommands.exSynFadeIn()
      }
      if (roomVar < LoudThreshold) {
        musicCommands.tomFadeIn()
      }
    }
  }

export const onStill =
  (roomVar: number, musicCommands: ReturnType<typeof music>) => (stillFrames: number) => {
    if (stillFrames === 0) return
    if (stillFrames % (eventThresholdSeconds * FrameRate) === 0) {
      sketchConfigStore.update('fillColor', (c) => moveColor(c, -2, -2, -2, 2))
      if (roomVar > SilentThreshold) {
        musicCommands.exSynFadeOut()
      }
      if (roomVar < LoudThreshold) {
        musicCommands.tomFadeOut()
      }
    }
    if (stillFrames % (eventThresholdSeconds2 * FrameRate) === 0) {
      if (roomVar > SilentThreshold) {
        musicCommands.padFadeIn()
      }
      if (roomVar < LoudThreshold) {
        musicCommands.kickFadeIn()
      }
    }
    if (stillFrames % (eventThresholdSeconds3 * FrameRate) === 0) {
      musicCommands.startMod()
    }
  }
