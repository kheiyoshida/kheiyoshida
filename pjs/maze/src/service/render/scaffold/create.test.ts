import {
  ScaffoldLayerCoordPosition,
  ScaffoldLengths,
  createScaffold,
  createScaffoldLayer,
  createScaffoldLayerPart,
  getLayerZValue,
  makeGetScaffoldXValue,
  makegetLayerYValue,
} from '.'
import { ScaffoldParams } from '../../../domain/stats'

const params: ScaffoldParams = {
  corridorWidthLevel: 1,
  wallHeightLevel: 1,
  corridorLengthLevel: 1,
  distortionLevel: 0,
}

const defaultLengths: ScaffoldLengths = {
  floor: 400,
  path: 800,
  wall: 400,
}

test(`${createScaffold.name}`, () => {
  const scaffold = createScaffold(params)
  expect(scaffold).toHaveLength(7)
})

test(`${createScaffoldLayer.name}`, () => {
  const layer = createScaffoldLayer(1, defaultLengths)
  expect(layer.lower[ScaffoldLayerCoordPosition.LL][2]).toBe(
    getLayerZValue(1, defaultLengths.floor, defaultLengths.path)
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
  const getY = makegetLayerYValue(height, defaultLengths.wall)
  expect(getY('lower')).toBe(defaultLengths.wall / 2)
  expect(getY('upper')).toBe(expected)
})

test(`${createScaffoldLayerPart.name}`, () => {
  const [y, z] = [500, 1500]
  const layerPart = createScaffoldLayerPart(y, z, defaultLengths)
  layerPart.forEach((pos, i) => {
    expect(pos[0]).toBe(makeGetScaffoldXValue(defaultLengths.floor, defaultLengths.path)(i))
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
  const getX = makeGetScaffoldXValue(defaultLengths.floor, defaultLengths.path)
  expect(getX(position)).toBe(expected)
})
