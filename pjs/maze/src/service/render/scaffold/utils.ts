import { Scaffold, ScaffoldEntity, ScaffoldKey, ScaffoldLayer } from './types'

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
