import {
  GridColumn,
  GridRow,
  SceneComponentMaker,
  SceneMaker,
  createSceneGrid,
  injectSceneMakerDeps,
} from 'mgnr-tone'
import * as cp from './components'

export type Saturation = 'thin' | 'neutral' | 'thick'
export type Randomness = 'static' | 'hybrid' | 'dynamic'

const saturationMap: Record<GridColumn, Saturation> = {
  left: 'thin',
  center: 'neutral',
  right: 'thick',
}

const randomnessMap: Record<GridRow, Randomness> = {
  top: 'static',
  middle: 'hybrid',
  bottom: 'dynamic',
}

export const translate = ({ col, row }: { col: GridColumn; row: GridRow }) => ({
  saturation: saturationMap[col],
  randomness: randomnessMap[row],
})

export type AvailableOutlets = 'synth' | 'pad' | 'drums' | 'bass' | 'droneBass'

export type DemoComponentMaker = SceneComponentMaker<AvailableOutlets>
export type DemoSceneMaker = SceneMaker<AvailableOutlets>

const ambient = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  top: cp.movingPad(meta),
  // left: cp.longDroneBass,
  // right: cp.defaultSynth,
})

const electronica: DemoSceneMaker = injectSceneMakerDeps({
  top: cp.longPad,
  right: cp.defaultSynth,
  bottom: cp.defaultDrums,
})

const dnb = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  left: cp.defaultBass,
  top: cp.movingPad(meta),
  bottom: cp.dnbDrums,
})

const devScene: DemoSceneMaker = ambient('static')

export const themeGrid = createSceneGrid({
  'left-top': ambient('static'),
  'left-middle': ambient('hybrid'),
  'left-bottom': ambient('dynamic'),

  'center-top': ambient('static'),
  'center-middle': ambient('hybrid'),
  'center-bottom': ambient('dynamic'),

  'right-top': dnb('static'),
  'right-middle': dnb('hybrid'),
  'right-bottom': dnb('dynamic'),
})
