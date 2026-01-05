import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'
import { MazeBlock } from '../block.ts'
import { ModelEntity, ModelEntityEmitter } from './entity.ts'
import { PhysicalGridParams } from './index.ts'
import { VerticalLayer } from '../grid.ts'
import { MazeObject } from '../object.ts'

export type PhysicalGridSlice = VerticalGrid3DSlice<MazeBlock>

type SliceType = 'floorSlice' | 'nullSlice' | 'fillSlice' | 'emptySlice' | 'stairSlice'

export class SliceMapper {
  private entityEmitter: ModelEntityEmitter

  private density: number

  constructor(params: PhysicalGridParams) {
    this.entityEmitter = new ModelEntityEmitter(params.density, params.gravity)
    this.density = params.density
  }

  private shouldFill(): boolean {
    return Math.random() < this.density
  }

  map(slice: PhysicalGridSlice, sliceType: SliceType): void {
    switch (sliceType) {
      case 'floorSlice':
        this.mapFloorSlice(slice)
        break
      case 'nullSlice':
        if (this.shouldFill()) this.mapFillSlice(slice)
        else this.mapEmptySlice(slice)
        break
      case 'fillSlice':
        this.mapFillSlice(slice)
        break
      case 'emptySlice':
        this.mapEmptySlice(slice)
        break
      case 'stairSlice':
        break
    }
  }

  private mapFloorSlice(slice: PhysicalGridSlice) {
    const up2 = this.entityEmitter.emitNullable({ avoidModelType: 'stacked' })
    const up1 = this.entityEmitter.emitNullable({ avoidModelType: 'stacked' })

    if (up2) slice.set(VerticalLayer.Up2, new MazeBlock([new MazeObject(up2)]))
    if (up1) slice.set(VerticalLayer.Up1, new MazeBlock([new MazeObject(up1)]))

    const down1 = this.entityEmitter.emitEnsured({ maxLength: 2 })
    slice.set(VerticalLayer.Down1, new MazeBlock([new MazeObject(down1)]))

    if (down1.modelType == 'stacked') {
      const down2 = this.entityEmitter.emitEnsured({ avoidModelType: 'floating' })
      slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject(down2)]))
    } else {
      const down2 = this.entityEmitter.emitNullable()
      if (down2) slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject(down2)]))
    }
  }

  private mapFillSlice(slice: PhysicalGridSlice): void {
    let stack = false
    let cursor: VerticalLayer = VerticalLayer.Up2
    while (cursor <= VerticalLayer.Down2) {
      let entity: ModelEntity | null = null
      if (stack) {
        entity = this.entityEmitter.emitEnsured({ avoidModelType: 'floating', maxLength: 5 })
      } else if (cursor === VerticalLayer.Middle) {
        entity = this.entityEmitter.emitEnsured({ maxLength: 5 })
      } else {
        entity = this.entityEmitter.emitNullable({ maxLength: 5 })
      }

      if (entity) {
        slice.set(cursor, new MazeBlock([new MazeObject(entity)]))
        if (entity.modelType == 'stacked') {
          stack = true
          cursor += entity.verticalLength
          continue
        }
      }

      cursor++
    }
  }

  private mapEmptySlice(slice: PhysicalGridSlice) {
    const up2 = this.entityEmitter.emitNullable({ avoidModelType: 'stacked' })
    if (up2) slice.set(VerticalLayer.Up2, new MazeBlock([new MazeObject(up2)]))

    const up1 = this.entityEmitter.emitNullable({ avoidModelType: 'stacked' })
    if (up1) slice.set(VerticalLayer.Up1, new MazeBlock([new MazeObject(up1)]))

    const down2 = this.entityEmitter.emitNullable()
    if (down2) slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject(down2)]))
  }
}
