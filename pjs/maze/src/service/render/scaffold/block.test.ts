import { RenderBlockCoords, RenderBlockLayer } from '.'
import { RenderPosition } from '../../../domain/compose/renderSpec'
import { MockScaffold } from './__test__/mock'
import { getAltBlock, getBlockLayer, getAdjacentBlock, makeGetRenderBlock } from './block'

test(`${makeGetRenderBlock.name}`, () => {
  const scaffold = MockScaffold
  const getRenderBlock = makeGetRenderBlock(scaffold)
  const block = getRenderBlock({ x: RenderPosition.LEFT, z: 5 })
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

test(`${getAltBlock.name}`, () => {
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
  const altBlock = getAltBlock(block, { y: 1000, z: -1000 })
  Object.entries(altBlock.front).forEach(([k, [x, y, z]]) => {
    const original = block.front[k as keyof RenderBlockLayer]
    expect(x).toBe(original[0])
    expect(y).toBe(original[1] + 1000)
    expect(z).toBe(original[2] - 1000)
  })
  Object.entries(altBlock.rear).forEach(([k, [x, y, z]]) => {
    const original = block.rear[k as keyof RenderBlockLayer]
    expect(x).toBe(original[0])
    expect(y).toBe(original[1] + 1000)
    expect(z).toBe(original[2] - 1000)
  })
})

test(`${getAdjacentBlock.name}`, () => {
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
  const slideBlock = getAdjacentBlock(block, { z: -1000 })
  Object.entries(slideBlock.front).forEach(([k, [_, __, z]]) => {
    const original = block.rear[k as keyof RenderBlockLayer]
    expect(z).toBe(original[2])
  })
  Object.entries(slideBlock.rear).forEach(([k, [_, __, z]]) => {
    const original = block.rear[k as keyof RenderBlockLayer]
    expect(z).toBe(original[2] - 1000)
  })
})