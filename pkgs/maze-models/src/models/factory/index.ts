import { boxSpec, stairBoxSpec } from './primitives/box'

const baseGeometries = {
  Box: boxSpec,
  StairBox: stairBoxSpec,
}

/**
 * get the base geometry spec. it deep-copies the geometry spec
 */
export const getBaseGeometry = (key: keyof typeof baseGeometries) => {
  return JSON.parse(JSON.stringify(baseGeometries[key]))
}
