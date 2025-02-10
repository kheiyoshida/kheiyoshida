import { ScaleSource, Scene, SceneComponent, SceneComponentPosition } from 'mgnr-tone'
import { GridColumn, GridRow, GridSubPosition } from '.'

/**
 * function that makes up a scene for a cell in a grid sub position
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
