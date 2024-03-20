import { Scene, ScenePattern, ScenePatternParams } from '../../../../domain/color/types'
import { ColorPalette } from './palette'

export type ColorManipFn<S extends Scene> = (
  palette: ColorPalette,
  params: ScenePatternParams<S>
) => ColorPalette

export type ColorManipFnMap<S extends Scene> = { [k in ScenePattern<S>]: ColorManipFn<S> }
