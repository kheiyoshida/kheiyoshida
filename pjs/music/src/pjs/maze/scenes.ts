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
  left: cp.longDroneBass(meta),
  center: cp.movingPad(meta),
  top: cp.defaultSynth(meta),
})

export const makeDefaultScenes = () => createSceneGrid({
  'left-top': ambient('static'),
  'left-middle': ambient('hybrid'),
  'left-bottom': ambient('dynamic'),

  'center-top': ambient('static'),
  'center-middle': ambient('hybrid'), // 
  'center-bottom': ambient('dynamic'),

  'right-top': ambient('static'),
  'right-middle': ambient('hybrid'),
  'right-bottom': ambient('dynamic'),
})
