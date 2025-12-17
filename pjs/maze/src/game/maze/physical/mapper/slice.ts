import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'
import { MazeBlock } from '../block.ts'
import { ModelEntityEmitter } from './entity.ts'
import { PhysicalGridParams } from './index.ts'

export type PhysicalGridSlice = VerticalGrid3DSlice<MazeBlock>

type SliceType = 'floorSlice' | 'nullSlice' | 'fillSlice' |  'emptySlice' | 'stairSlice'

export class SliceMapper {
  private entityEmitter: ModelEntityEmitter

  private density: number

  constructor(params: PhysicalGridParams) {
    this.entityEmitter = new ModelEntityEmitter(params.density, params.gravity)
    this.density = params.density
  }

  map(slice: PhysicalGridSlice, sliceType: SliceType): void {
    throw new Error('Not implemented')
  }
}
