import { RenderPosition } from '../../../compose/renderSpec'
import { DrawPath } from '../../draw/patterns/factory'
import { Layer } from '../../frame/layer'

export const extendHorizontal = (
  path: DrawPath,
  p: RenderPosition,
  r = 1
): DrawPath => {
  const len = r * (path[1][0] - path[0][0])
  if (p === RenderPosition.LEFT)
    return [[path[0][0] - len, path[0][1]], path[1]]
  else return [path[0], [path[1][0] + len, path[1][1]]]
}

const midInnerLength = (l: Layer, p: RenderPosition): number =>
  p === RenderPosition.LEFT
    ? l.inner.bl[0] - l.middle.bl[0]
    : l.middle.br[0] - l.inner.br[0]

export const omitLength = (
  path: DrawPath,
  l: Layer,
  p: RenderPosition
): DrawPath =>
  p === RenderPosition.LEFT
    ? [[path[0][0] + midInnerLength(l, p), path[0][1]], path[1]]
    : [path[0], [path[1][0] - midInnerLength(l, p), path[1][1]]]
