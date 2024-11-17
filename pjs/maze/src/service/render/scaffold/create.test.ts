import {
  createScaffold,
  createScaffoldLayer,
  createScaffoldLayerPart,
  getLayerZValue,
  makeGetScaffoldXValue,
  makegetLayerYValue,
} from './create.ts'
import { ScaffoldLayerCoordPosition, ScaffoldValues } from './types.ts'

const defaultValues: ScaffoldValues = {
  floor: 400,
  path: 800,
  wall: 400,
  distortionRange: 0,
  distortionSpeed: 0,
}

test(`${createScaffold.name}`, () => {
  const scaffold = createScaffold(defaultValues)
  expect(scaffold).toHaveLength(7)
})

test(`${createScaffoldLayer.name}`, () => {
  const layer = createScaffoldLayer(1, defaultValues)
  expect(layer.lower[ScaffoldLayerCoordPosition.LL][2]).toBe(
    getLayerZValue(1, defaultValues.floor, defaultValues.path)
  )
})

test.each([
  [0, 300],
  [1, -300],
  [2, -1300],
  [3, -1900],
  [4, -2900],
])(`${getLayerZValue.name} (%i)`, (index, expected) => {
  expect(getLayerZValue(index, 600, 1000)).toBe(expected)
})

test.each([
  [400, -200],
  [800, -600],
  [1200, -1000],
])(`${makegetLayerYValue.name} (%i)`, (height, expected) => {
  const getY = makegetLayerYValue(height, defaultValues.wall)
  expect(getY('lower')).toBe(defaultValues.wall / 2)
  expect(getY('upper')).toBe(expected)
})

test(`${createScaffoldLayerPart.name}`, () => {
  const [y, z] = [500, 1500]
  const layerPart = createScaffoldLayerPart(y, z, defaultValues)
  layerPart.forEach((pos, i) => {
    expect(pos[0]).toBe(makeGetScaffoldXValue(defaultValues.floor, defaultValues.path)(i))
    expect(pos[1]).toBe(y)
    expect(pos[2]).toBe(z)
  })
})

test.each([
  [ScaffoldLayerCoordPosition.LL, -1000],
  [ScaffoldLayerCoordPosition.CL, -200],
  [ScaffoldLayerCoordPosition.CR, 200],
  [ScaffoldLayerCoordPosition.RR, 1000],
])(`${makeGetScaffoldXValue.name}(%s)`, (position, expected) => {
  const getX = makeGetScaffoldXValue(defaultValues.floor, defaultValues.path)
  expect(getX(position)).toBe(expected)
})
