import { RenderPosition } from '../../../../domain/translate/renderGrid/renderSpec'
import { MockScaffold } from '../__test__/mock'
import {
  getAdjacentBlockZ,
  getAdjacentLayerY,
  getBlockCenter,
  getBlockLayer,
  getReducedPointFromCenter,
  getRenderBlock,
  getSmallerBlock,
} from './block'
import { RenderBlockCoords, RenderBlockLayer } from '../types'

test(`${getRenderBlock.name}`, () => {
  const scaffold = MockScaffold
  const block = getRenderBlock(scaffold, { x: RenderPosition.LEFT, z: 5 })
  expect(block.front).toMatchObject({
    tl: [-1500, -500, -4500],
    tr: [-500, -500, -4500],
    bl: [-1500, 500, -4500],
    br: [-500, 500, -4500],
  })
  expect(block.rear).toMatchObject({
    tl: [-1500, -500, -5500],
    tr: [-500, -500, -5500],
    bl: [-1500, 500, -5500],
    br: [-500, 500, -5500],
  })
})

test(`${getBlockLayer.name}`, () => {
  const layer = getBlockLayer(MockScaffold[6], 0)
  expect(layer).toMatchObject({
    tl: [-1500, -500, -5500],
    tr: [-500, -500, -5500],
    bl: [-1500, 500, -5500],
    br: [-500, 500, -5500],
  })
})

test(`${getAdjacentLayerY.name}`, () => {
  const layer: RenderBlockLayer = {
    tl: [-100, -50, 10],
    tr: [100, -50, -10],
    bl: [-100, 50, -10],
    br: [80, 40, 10],
  }
  const result = getAdjacentLayerY(layer)
  expect(result).toMatchObject({
    tl: layer.bl,
    tr: layer.br,
    bl: [-100, 150, 10],
    br: [100, 130, -10],
  })
})

test(`${getAdjacentBlockZ.name}`, () => {
  const block: RenderBlockCoords = {
    front: {
      tl: [-1500, -500, -4500],
      tr: [-500, -500, -4500],
      bl: [-1500, 500, -4500],
      br: [-500, 500, -4500],
    },
    rear: {
      tl: [-1500, -500, -5500],
      tr: [-500, -500, -5500],
      bl: [-1500, 500, -5500],
      br: [-500, 500, -5500],
    },
  }
  const slideBlock = getAdjacentBlockZ(block, { z: -1000 })
  Object.entries(slideBlock.front).forEach(([k, [_, __, z]]) => {
    const original = block.rear[k as keyof RenderBlockLayer]
    expect(z).toBe(original[2])
  })
  Object.entries(slideBlock.rear).forEach(([k, [_, __, z]]) => {
    const original = block.rear[k as keyof RenderBlockLayer]
    expect(z).toBe(original[2] - 1000)
  })
})

test(`${getBlockCenter.name}`, () => {
  const block: RenderBlockCoords = {
    front: {
      tl: [-1500, -500, -500],
      tr: [-500, -500, -500],
      bl: [-1500, 500, -500],
      br: [-500, 500, -500],
    },
    rear: {
      tl: [-1500, -500, -1500],
      tr: [-500, -500, -1500],
      bl: [-1500, 500, -1500],
      br: [-500, 500, -1500],
    },
  }
  const result = getBlockCenter(block)
  expect(result).toMatchInlineSnapshot(`
    [
      -1000,
      0,
      -1000,
    ]
  `)
})

test(`${getSmallerBlock.name}`, () => {
  const block: RenderBlockCoords = {
    front: {
      tl: [-1500, -500, -500],
      tr: [-500, -500, -500],
      bl: [-1500, 500, -500],
      br: [-500, 500, -500],
    },
    rear: {
      tl: [-1500, -500, -1500],
      tr: [-500, -500, -1500],
      bl: [-1500, 500, -1500],
      br: [-500, 500, -1500],
    },
  }
  const result = getSmallerBlock(block, 0.5)
  expect(result).toEqual({
    front: {
      tl: [-1250, -250, -750],
      tr: [-750, -250, -750],
      bl: [-1250, 250, -750],
      br: [-750, 250, -750],
    },
    rear: {
      tl: [-1250, -250, -1250],
      tr: [-750, -250, -1250],
      bl: [-1250, 250, -1250],
      br: [-750, 250, -1250],
    },
  })
})

test(`${getReducedPointFromCenter.name}`, () => {
  const result = getReducedPointFromCenter([100, 100, 100], [150, 150, 100], 0.8)
  expect(result).toEqual([140, 140, 100])
})