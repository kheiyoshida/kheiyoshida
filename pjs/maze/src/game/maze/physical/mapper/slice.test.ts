import { PhysicalGridSlice, SliceMapper } from './slice.ts'
import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'
import { VerticalLayer } from '../grid.ts'
import { MazeBlock } from '../block.ts'
import { ModelEntity } from 'maze-models'

const getBlockEntity = (block: MazeBlock): ModelEntity => block.objects[0].model!

const printSlice = (slice: PhysicalGridSlice): void => {
  console.log(
    slice.items
      .map((item) =>
        item
          ? `${item?.objects[0].model.code} ${item?.objects[0].model?.modelType} ${item?.objects[0].model?.verticalLength}`
          : 'null'
      )
      .join(', ')
  )
}

describe(`${SliceMapper.name}`, () => {
  test(`floor slice`, () => {
    const sliceMapper = new SliceMapper({
      density: 0.5,
      gravity: 0.5,
      stairType: 'stair',
    })

    for (let i = 0; i < 10; i++) {
      const slice: PhysicalGridSlice = new VerticalGrid3DSlice(5)
      sliceMapper.map(slice, 'floorSlice')

      // Up1 and Up2 should be empty or come with floating model
      const up1 = slice.get(VerticalLayer.Up1)
      const up2 = slice.get(VerticalLayer.Up2)
      expect(up1 === null || getBlockEntity(up1).modelType === 'floating').toBe(true)
      expect(up2 === null || getBlockEntity(up2).modelType === 'floating').toBe(true)

      // middle should be empty
      expect(slice.get(VerticalLayer.Middle)).toBeNull()

      // Down1 should not be null
      const down1 = slice.get(VerticalLayer.Down1)!
      expect(down1).not.toBeNull()

      // Down2 can either be empty, Stacked or Floating
      const down2 = slice.get(VerticalLayer.Down2)

      // but down2 should be stacked if down1 is stacked
      if (getBlockEntity(down1).modelType == 'stacked') {
        if (down1.objects[0].model.code.includes('2')) continue
        expect(down2).not.toBeNull()
        expect(getBlockEntity(down2!).modelType).toBe('stacked')
      }
    }
  })

  test(`fillSlice`, () => {
    const sliceMapper = new SliceMapper({
      density: 0.3,
      gravity: 0.5,
      stairType: 'stair',
    })

    for (let i = 0; i < 10; i++) {
      const slice: PhysicalGridSlice = new VerticalGrid3DSlice(5)
      sliceMapper.map(slice, 'fillSlice')

      // each block can be empty/floating/stacked, but if it's stacked, the rest should be stacked too
      const up2 = slice.get(VerticalLayer.Up2)
      const up1 = slice.get(VerticalLayer.Up1)
      const middle = slice.get(VerticalLayer.Middle)
      const down1 = slice.get(VerticalLayer.Down1)
      const down2 = slice.get(VerticalLayer.Down2)

      const blocks = [up2, up1, middle, down1, down2]
      let cursor = 0

      while (cursor < 5) {
        const block = blocks[cursor]

        if (cursor === VerticalLayer.Middle) {
          expect(block).not.toBeNull()
        }

        if (block !== null) {
          const entity = getBlockEntity(block)
          if (entity.modelType == 'stacked') {
            cursor += entity.verticalLength
            if (cursor >= 5) break
            const blockBelow = blocks[cursor]
            expect(blockBelow).toBeTruthy()
            const blockBelowEntity = getBlockEntity(blockBelow!)
            expect(blockBelowEntity.modelType == 'stacked').toBe(true)
            continue
          }
        }
        cursor++
      }
      // printSlice(slice)
    }
  })

  test(`empty slice`, () => {
    const sliceMapper = new SliceMapper({
      density: 0.2,
      gravity: 0.5,
      stairType: 'stair',
    })

    for (let i = 0; i < 10; i++) {
      const slice: PhysicalGridSlice = new VerticalGrid3DSlice(5)
      sliceMapper.map(slice, 'emptySlice')

      const up2 = slice.get(VerticalLayer.Up2)
      const up1 = slice.get(VerticalLayer.Up1)
      const middle = slice.get(VerticalLayer.Middle)
      const down1 = slice.get(VerticalLayer.Down1)

      // Up1 and Up2 should be floating or empty
      expect(up2 == null || getBlockEntity(up2).modelType == 'floating').toBe(true)
      expect(up1 == null || getBlockEntity(up1).modelType == 'floating').toBe(true)

      // Middle & Down1 should be empty
      expect(middle).toBeNull()
      expect(down1).toBeNull()

      // Down2 can either be empty, Stacked or Floating
    }
  })
})
