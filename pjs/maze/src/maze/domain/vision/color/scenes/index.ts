import { ListenableState } from '../..'
import { ColorPalette } from '../palette'

/**
 * function to be provided to the client
 *
 * consumed with `SceneParams` to obtain new `ColorPalette` for the scene
 */
export type Scene = (
  palette: ColorPalette,
  state: ListenableState
) => ColorPalette

/**
 * string key to select manipulation pattern
 */
export type ScenePattern = string

/**
 * params to be passed to `ManipFn`
 */
export type SceneParams<P extends ScenePattern> = [pattern: P, ...args: any[]]

/**
 * fn to convert state into consumable `SceneParams`
 */
export type ParameterizeState<P extends ScenePattern> = (
  state: ListenableState
) => SceneParams<P>

/**
 * manipulate current palette
 * using different palette methods
 * and params derived from state
 */
export type ManipFn<P extends ScenePattern> = (
  palette: ColorPalette,
  params: SceneParams<P>
) => ColorPalette

/**
 * map for differnt manipulation functions
 */
export type ManipMap<P extends ScenePattern> = { [k in P]: ManipFn<P> }

/**
 * finalize scene as a function to be picked by client
 */
export const bundleScene =
  <P extends ScenePattern>(
    parameterize: ParameterizeState<P>,
    map: ManipMap<P>
  ): Scene =>
  (palette, state) => {
    const params = parameterize(state)
    return map[params[0]](palette, params)
  }
