import { GeneratorConf, Middlewares, ScaleSource, SequenceGenerator, SequenceNoteMap } from 'mgnr-core'
import { GridSubPosition, GridColumn, GridRow } from './grid'

/**
 * A collection of generator specifications
 * where each component is positioned
 */
export type Scene<AvailableOutlets = string> = {
  [k in SceneComponentPosition]?: SceneComponent<AvailableOutlets>
}
export type SceneComponentPosition = 'top' | 'bottom' | 'right' | 'left' | 'center'
export type SceneComponent<AvailableOutlets = string> = {
  outId: AvailableOutlets
  generators: GeneratorSpec[]
}
export type GeneratorSpec<MW extends Middlewares = Middlewares> = {
  generator: GeneratorConf
  notes?: SequenceNoteMap
  middlewares?: MW
  loops: number
  onElapsed: (g: SequenceGenerator<MW>) => void
  onEnded: (g: SequenceGenerator<MW>) => void
}

/**
 * function that makes up a scene
 */
export type MakeScene<AvailableOutlets = string> = (
  source: ScaleSource,
  gridSubPosition: GridSubPosition
) => Scene<AvailableOutlets>

type SceneComponentMakerMap<O> = { [k in SceneComponentPosition]?: MakeSceneComponent<O> }

export type MakeSceneComponent<AvailableOutlets = string> = (
  source: ScaleSource,
  subPosition: {
    col: GridColumn
    row: GridRow
  }
) => SceneComponent<AvailableOutlets>

export const injectSceneMakerDeps =
  <O = string>(components: SceneComponentMakerMap<O>): MakeScene<O> =>
  (source, gridSubPosition) => {
    const [col, row] = splitPos(gridSubPosition)
    return Object.fromEntries(Object.entries(components).map(([k, v]) => [k, v(source, { col, row })]))
  }
const splitPos = (pos: GridSubPosition) => pos.split('-') as [GridColumn, GridRow]
