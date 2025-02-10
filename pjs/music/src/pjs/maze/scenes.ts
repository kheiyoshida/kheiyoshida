import {
  createSceneGrid,
  GridColumn,
  GridRow,
  injectSceneMakerDeps,
  MakeScene,
  MakeSceneComponent,
} from '../../grid'
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

export type AvailableOutlets = 'pad' | 'noise' | 'droneBass' | 'synth'

export type DemoComponentMaker = MakeSceneComponent<AvailableOutlets>
export type DemoSceneMaker = MakeScene<AvailableOutlets>

const thin = (meta: Randomness): DemoSceneMaker =>
  injectSceneMakerDeps({
    left: cp.synth(meta),
    center: cp.thinPad(meta),
    ...(meta === 'static' ? {} : { bottom: cp.defaultNoise(meta) }),
  })

const neutral = (meta: Randomness): DemoSceneMaker =>
  injectSceneMakerDeps({
    center: cp.defaultPad(meta),
    ...(meta === 'static' ? {} : { bottom: cp.defaultNoise(meta) }),
  })

const thick = (meta: Randomness): DemoSceneMaker =>
  injectSceneMakerDeps({
    right: cp.longDroneBass(meta),
    center: cp.thickPad(meta),
    ...(meta === 'static' ? {} : { bottom: cp.defaultNoise(meta) }),
  })

export const makeDefaultScenes = () =>
  createSceneGrid(
    {
      'left-top': thin('static'),
      'left-middle': thin('hybrid'),
      'left-bottom': thin('dynamic'),

      'center-top': neutral('static'),
      'center-middle': neutral('hybrid'), //
      'center-bottom': neutral('dynamic'),

      'right-top': thick('static'),
      'right-middle': thick('hybrid'),
      'right-bottom': thick('dynamic'),
    },
    'center-middle',
    'center-middle'
  )
