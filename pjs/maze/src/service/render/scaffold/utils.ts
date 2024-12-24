import { LR } from '../../../domain/entities/utils/direction.ts'
import {
  Scaffold,
  ScaffoldEntity,
  ScaffoldKey,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
} from './types.ts'

export const iterateScaffold = <T extends ScaffoldEntity>(
  scaffold: Scaffold<T>,
  cb: (entity: T, key: ScaffoldKey) => void
) => {
  scaffold.forEach((layer, layerIndex) => {
    layer.upper.forEach((entity, position) =>
      cb(entity, { layerIndex, partKey: 'upper', position })
    )
    layer.lower.forEach((entity, position) =>
      cb(entity, { layerIndex, partKey: 'lower', position })
    )
  })
}

export const retrieveScaffoldEntity = <T extends ScaffoldEntity>(
  scaffold: Scaffold<T>,
  { layerIndex, partKey, position }: ScaffoldKey
): T => {
  return scaffold[layerIndex][partKey][position]
}

export const slideScaffoldLayers = <T extends ScaffoldEntity>(
  scaffold: Scaffold<T>,
  slide: number,
  createLayer: () => ScaffoldLayer<T>
): Scaffold<T> => {
  return [...scaffold.slice(slide), ...[...Array(slide)].map(createLayer)]
}

export const turnScaffold = <T extends ScaffoldEntity>(
  scaffold: Scaffold<T>,
  turn: LR,
  createLayer: () => ScaffoldLayer<T>
): Scaffold<T> => {
  const newScaffold: Scaffold<T> = [...Array(scaffold.length)].map(createLayer)
  const turnMap = turn === 'right' ? TurnMapRight : TurnMapLeft
  turnMap.forEach(([key, newKey]) => {
    newScaffold[newKey[0]]['lower'][newKey[1]] = scaffold[key[0]]['lower'][key[1]]
    newScaffold[newKey[0]]['upper'][newKey[1]] = scaffold[key[0]]['upper'][key[1]]
  })
  return newScaffold
}

type TurnKey = [layerIndex: number, position: ScaffoldLayerCoordPosition]

// prettier-ignore
const TurnMapRight: Array<[TurnKey, TurnKey]> = [
  [[0, 1], [0,2]],
  [[0, 2], [1,2]],
  [[0, 3], [2,2]],
  [[1, 1], [0,1]],
  [[1, 2], [1,1]],
  [[1, 3], [2,1]],
  [[2, 1], [0,0]],
  [[2, 2], [1,0]],
  [[2, 3], [2,0]],
]

// prettier-ignore
const TurnMapLeft: Array<[TurnKey, TurnKey]> = [
  [[0, 0], [2,1]],
  [[0, 1], [1,1]],
  [[0, 2], [0,1]],

  [[1, 0], [2,2]],
  [[1, 1], [1,2]],
  [[1, 2], [0,2]],

  [[2, 0], [2,3]],
  [[2, 1], [1,3]],
  [[2, 2], [0,3]],
]
