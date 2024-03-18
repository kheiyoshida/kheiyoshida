import { RenderPosition } from '../../../../domain/compose/renderSpec'
import { MockScaffold } from './__test__/mock'
import { getBlockLayer, makeGetRenderBlock } from './block'

test(`${makeGetRenderBlock.name}`, () => {
  const scaffold = MockScaffold
  const getRenderBlock = makeGetRenderBlock(scaffold)
  const block = getRenderBlock({
    x: RenderPosition.LEFT,
    z: 5,
  })
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
