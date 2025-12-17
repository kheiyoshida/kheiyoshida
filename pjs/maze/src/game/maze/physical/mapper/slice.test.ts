import { PhysicalGridSlice, SliceMapper } from './slice.ts'
import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'
import { VerticalLayer } from '../grid.ts'
import { ModelType } from './entity.ts'
import { ModelCode } from 'maze-models'

const modelType = (code: ModelCode): ModelType => {
  switch (code) {
    case "Floor":
    case "Ceil":
    case "Wall":
    case "StairSteps":
    case "StackableBox":
    case "StackableStairBox":
    case "Pole":
      return "stacked"

    case "StairCeil":
    case "Tile":
    case "StairTile":
    case "BottomTile":
    case "FloatingBox":
    case "FloatingStairBox":
    case "FloatingFloorBox":
    case "Warp":
      return "floating"
  }
}

describe(`${SliceMapper.name}`, () => {
  test(`floor slice`, () => {
    const slice: PhysicalGridSlice = new VerticalGrid3DSlice(5)

    const sliceMapper = new SliceMapper({
      density: 0.5,
      gravity: 0.5,
      stairType: 'stair',
    })

    for(let i = 0; i < 10; i++) {
      sliceMapper.map(slice, 'floorSlice')

      // Up1 and Up2 should be empty or come with floating model
      const up1 = slice.get(VerticalLayer.Up1)
      const up2 = slice.get(VerticalLayer.Up2)
      expect(up1 === null || modelType(up1.objects[0].model.code) === 'floating')
      expect(up2 === null || modelType(up2.objects[0].model.code) === 'floating')

      // middle should be empty
      expect(slice.get(VerticalLayer.Middle)).toBeNull()

      // Down1 should not be null
      const down1 = slice.get(VerticalLayer.Down1)!
      expect(down1).not.toBeNull()

      // Down2 can either be empty, Stacked or Floating
      const down2 = slice.get(VerticalLayer.Down2)

      // but down2 should be stacked if down1 is stacked
      if (modelType(down1.objects[0].model.code) == 'stacked') {
        if (down1.objects[0].model.code.includes('2')) continue;
        expect(down2).not.toBeNull()
        expect(modelType(down2!.objects[0].model.code)).toBe('stacked')
      }
    }
  })
})
