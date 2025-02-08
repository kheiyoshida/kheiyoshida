import {
  GridColumn,
  GridRow,
  MakeSceneComponent,
  MakeScene,
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

export type DemoComponentMaker = MakeSceneComponent<AvailableOutlets>
export type DemoSceneMaker = MakeScene<AvailableOutlets>

const ambient = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  left: cp.longDroneBass(meta),
  center: cp.movingPad(meta),
  top: cp.defaultSynth(meta),
})

const electronica = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  top: cp.defaultSynth(meta),
  center: cp.longPad(meta),
  bottom: cp.defaultDrums(meta),
})

const dnb = (meta: Randomness): DemoSceneMaker => injectSceneMakerDeps({
  bottom: cp.dnbDrums(meta),
  center: cp.movingPad(meta),
  right: cp.defaultBass(meta),
})

export const makeDefaultScenes = () => createSceneGrid({
  'left-top': ambient('static'),
  'left-middle': ambient('hybrid'),
  'left-bottom': ambient('dynamic'),

  'center-top': electronica('static'),
  'center-middle': electronica('hybrid'), // 
  'center-bottom': electronica('dynamic'),

  'right-top': dnb('static'),
  'right-middle': dnb('hybrid'),
  'right-bottom': dnb('dynamic'),
})
