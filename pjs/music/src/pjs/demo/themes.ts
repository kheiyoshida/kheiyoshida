import { SceneComponentMaker, SceneMaker, createSceneGrid } from 'mgnr-tone'
import * as cp from './components'

export type Character = 'dark' | 'neutral' | 'bright'

export type AvailableOutlets = 'synth' | 'pad' | 'drums' | 'bass' | 'droneBass'

export type DemoComponentMaker = SceneComponentMaker<AvailableOutlets>
export type DemoSceneMaker = SceneMaker<AvailableOutlets>

const ambient: DemoSceneMaker = (source, alignment) => ({
  top: cp.movingPad(source, 3),
  left: cp.longDroneBass(source, 3),
  right: cp.defaultSynth(source, 3),
})

const electronica: DemoSceneMaker = (source, alignment) => ({
  top: cp.longPad(source, 3),
  right: cp.defaultSynth(source, 3),
  bottom: cp.defaultDrums(source, 3),
})

const dnb: DemoSceneMaker = (source, alignment) => ({
  left: cp.defaultBass(source, 3),
  top: cp.movingPad(source, 3),
  bottom: cp.dnbDrums(source, 3),
})

const devScene: DemoSceneMaker = dnb

export const themeGrid = createSceneGrid({
  // top
  'left-top': ambient,
  'center-top': ambient,
  'right-top': ambient,

  // middle
  'left-middle': electronica,
  'center-middle': electronica,
  'right-middle': electronica,

  // bottom
  'left-bottom': dnb,
  'center-bottom': dnb,
  'right-bottom': dnb,
})
