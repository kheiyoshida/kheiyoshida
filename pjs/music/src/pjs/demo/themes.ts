import { SceneComponentMaker, SceneMaker, createSceneGrid } from 'mgnr-tone'
import * as cp from './components'

export type Character = 'dark' | 'neutral' | 'bright'

export type AvailableOutlets = 'synth' | 'pad' | 'drums' | 'bass'

export type DemoComponentMaker = SceneComponentMaker<AvailableOutlets>
export type DemoSceneMaker = SceneMaker<AvailableOutlets>

const top: DemoSceneMaker = (source, alignment) => ({
  // top: cp.movingPad(source, 3),
  left: cp.longBass(source, 3),
  // right: cp.defaultSynth(source, 3),
})

const middle: DemoSceneMaker = (source, alignment) => ({
  // top: cp.longPad(source, 3),
  left: cp.defaultBass(source, 3),
  // right: cp.defaultSynth(source, 3),
  // bottom: cp.defaultDrums(source, 3),
})

const bottom: DemoSceneMaker = (source, alignment) => ({
  left: cp.defaultBass(source, 3),
  top: cp.longPad(source, 3),
  bottom: cp.dnbDrums(source, 3),
})

export const themeGrid = createSceneGrid({
  // top
  'left-top': top,
  'center-top': top,
  'right-top': top,

  // middle
  'left-middle': middle,
  'center-middle': middle,
  'right-middle': middle,

  // bottom
  'left-bottom': bottom,
  'center-bottom': bottom,
  'right-bottom': bottom,
})
