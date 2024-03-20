import {
  ScaffoldLayerCoordPosition,
  createScaffold,
  createScaffoldLayer,
  createScaffoldLayerPart,
  getLayerZValue,
  getScaffoldXValue,
} from '.'

test(`${createScaffold.name}`, () => {
  const scaffold = createScaffold(7)
  expect(scaffold).toHaveLength(7)
})

test(`${createScaffoldLayer.name}`, () => {
  const layer = createScaffoldLayer(1)
  expect(layer.lower[ScaffoldLayerCoordPosition.LL][2]).toBe(getLayerZValue(1))
})

test(`${createScaffoldLayerPart.name}`, () => {
  const [y, z] = [500, 1500]
  const layerPart = createScaffoldLayerPart(y, z)
  layerPart.forEach((pos, i) => {
    expect(pos[0]).toBe(getScaffoldXValue(i))
    expect(pos[1]).toBe(y)
    expect(pos[2]).toBe(z)
  })
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

