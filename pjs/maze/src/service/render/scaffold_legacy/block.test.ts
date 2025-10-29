
import { MockScaffold } from './__test__/mock.ts'
import { RenderBlock, RenderBlockLayer } from './types.ts'

import { getAdjacentBlockZ, getAdjacentLayerY, getBlockLayer, getRenderBlock } from './block.ts'

test(`${getRenderBlock.name}`, () => {
  const block = getRenderBlock(MockScaffold, { x: -1, z: 5, y: 0 })
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

test.skip(`${getBlockLayer.name}`, () => {
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
  const block: RenderBlock = {
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
