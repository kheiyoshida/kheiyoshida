import { SceneComponentMaker, SceneMaker, createSceneGrid, injectSceneMakerDeps } from 'mgnr-tone'
import * as cp from './components'

export type Character = 'dark' | 'neutral' | 'bright'

export type AvailableOutlets = 'synth' | 'pad' | 'drums' | 'bass' | 'droneBass'

export type DemoComponentMaker = SceneComponentMaker<AvailableOutlets>
export type DemoSceneMaker = SceneMaker<AvailableOutlets>

const ambient: DemoSceneMaker = injectSceneMakerDeps({
  top: cp.movingPad,
  left: cp.longDroneBass,
  right: cp.defaultSynth,
})

const electronica: DemoSceneMaker = injectSceneMakerDeps({
  top: cp.longPad,
  right: cp.defaultSynth,
  bottom: cp.defaultDrums
})

const dnb: DemoSceneMaker = injectSceneMakerDeps({
  left: cp.defaultBass,
  top: cp.movingPad,
  bottom: cp.dnbDrums
})

const devScene: DemoSceneMaker = ambient

export const themeGrid = createSceneGrid({
  // top
  'left-top': ambient,
  'center-top': ambient,
  'right-top': ambient,

  // middle
  'left-middle': electronica,
  'center-middle': devScene,
  'right-middle': electronica,

  // bottom
  'left-bottom': dnb,
  'center-bottom': dnb,
  'right-bottom': dnb,
})
