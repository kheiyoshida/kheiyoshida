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
  left: cp.longDroneBass(meta),
  right: cp.defaultSynth(meta),
})

const electronica = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  top: cp.longPad(meta),
  right: cp.defaultSynth(meta),
  bottom: cp.defaultDrums(meta),
})

const dnb = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  left: cp.defaultBass(meta),
  top: cp.movingPad(meta),
  bottom: cp.dnbDrums(meta),
})

export const themeGrid = createSceneGrid({
  'left-top': ambient('static'),
  'left-middle': ambient('hybrid'),
  'left-bottom': ambient('dynamic'),

  'center-top': electronica('static'),
  'center-middle': electronica('static'), // 
  'center-bottom': electronica('dynamic'),

  'right-top': dnb('static'),
  'right-middle': dnb('hybrid'),
  'right-bottom': dnb('dynamic'),
})
