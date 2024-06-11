import {
  GeneratorConf,
  Middlewares,
  ScaleSource,
  SequenceGenerator,
  SequenceNoteMap,
} from 'mgnr-core'
import { GridAlignment, GridColumn, GridRow } from './grid'

export type SceneMaker<AvailableOutlets = string> = (
  source: ScaleSource,
  alignment: GridAlignment
) => Scene<AvailableOutlets>

export type SceneComponentPosition = 'top' | 'bottom' | 'right' | 'left' | 'center'

export type Scene<AvailableOutlets = string> = {
  [k in SceneComponentPosition]?: SceneComponent<AvailableOutlets>
}

// & { updateAlignment(direction: GridDirection): void }

export type SceneComponentMaker<AvailableOutlets = string> = (
  source: ScaleSource,
  alignment: {
    col: GridColumn
    row: GridRow
  }
) => SceneComponent<AvailableOutlets>

export type GeneratorSpec<MW extends Middlewares = Middlewares> = {
  generator: GeneratorConf
  notes?: SequenceNoteMap
  middlewares?: MW
  loops: number
  onElapsed: (g: SequenceGenerator<MW>) => void
  onEnded: (g: SequenceGenerator<MW>) => void
}

export type SceneComponent<AvailableOutlets = string> = {
  outId: AvailableOutlets
  generators: GeneratorSpec[]
}

type SceneMakerMap<O> = { [k in SceneComponentPosition]?: SceneComponentMaker<O> }

export const injectSceneMakerDeps =
  <O = string>(components: SceneMakerMap<O>): SceneMaker<O> =>
  (source, alignment) => {
    const [col, row] = splitAlignment(alignment)
    return Object.fromEntries(
      Object.entries(components).map(([k, v]) => [k, v(source, { col, row })])
    )
  }

const splitAlignment = (alignment: GridAlignment) =>
  alignment.split('-') as [GridColumn, GridRow]
