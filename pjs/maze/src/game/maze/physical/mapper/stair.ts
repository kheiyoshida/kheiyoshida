import { ModelEntityEmitter } from './entity.ts'
import { PhysicalGridParams } from './index.ts'
import { StairType } from '../../stair.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { getPositionInDirection, Position2D } from '../../../../core/grid/position2d.ts'
import { Direction } from '../../../../core/grid/direction.ts'
import { MazeObject } from '../object.ts'
import { MazeBlock } from '../block.ts'
import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'

export class StairMapper {
  private entityEmitter: ModelEntityEmitter
  private stairType: StairType

  public constructor(params: PhysicalGridParams) {
    this.entityEmitter = new ModelEntityEmitter(params)
    this.stairType = params.stairType
  }

  mapStairSlices(grid: PhysicalMazeGrid, stairPos: Position2D, direction: Direction): void {
    switch (this.stairType) {
      case 'stair':
        this.mapStairStair(grid, stairPos, direction)
        break
      case 'lift':
        this.mapLiftStair(grid, stairPos, direction)
        break

      case 'path':
        this.mapPathStair(grid, stairPos, direction)
        break
    }
  }

  private mapStairStair(grid: PhysicalMazeGrid, stairPos: Position2D, direction: Direction) {
    const stairPosSlice = grid.getSliceByLogicalPosition(stairPos)
    stairPosSlice.set(VerticalLayer.Middle, null) // TODO: put ceiling for classic structure
    stairPosSlice.set(
      VerticalLayer.Down1,
      new MazeBlock([
        new MazeObject(
          this.entityEmitter.emitEnsured({ usage: 'stair', avoidModelType: 'floating' }),
          direction
        ),
      ])
    )
    stairPosSlice.set(
      VerticalLayer.Down2,
      new MazeBlock([new MazeObject(this.entityEmitter.emitEnsured({ avoidModelType: 'floating' }))])
    )

    for (let i = 1; i <= 4; i++) {
      const corridorPos = getPositionInDirection(stairPos, direction, i)
      const slice = grid.getSliceByLogicalPosition(corridorPos)
      this.removePole(slice)
      slice.set(VerticalLayer.Down1, null)
      slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject(this.entityEmitter.emitEnsured())]))
    }
  }

  private mapLiftStair(grid: PhysicalMazeGrid, stairPos: Position2D, direction: Direction) {
    const stairPosSlice = grid.getSliceByLogicalPosition(stairPos)
    stairPosSlice.set(
      VerticalLayer.Down1,
      new MazeBlock([new MazeObject(this.entityEmitter.emitEnsured({ usage: 'stair' }), direction)])
    )

    for (let i = 1; i <= 4; i++) {
      const corridorPos = getPositionInDirection(stairPos, direction, i)
      const slice = grid.getSliceByLogicalPosition(corridorPos)
      this.removePole(slice)
      slice.set(VerticalLayer.Down2, null)
      if (i !== 0)
        slice.set(VerticalLayer.Down3, new MazeBlock([new MazeObject(this.entityEmitter.emitEnsured())]))
    }
  }

  private mapPathStair(grid: PhysicalMazeGrid, stairPos: Position2D, direction: Direction) {
    for (let i = 0; i <= 4; i++) {
      const corridorPos = getPositionInDirection(stairPos, direction, i)
      const slice = grid.getSliceByLogicalPosition(corridorPos)
      this.removePole(slice)
      slice.set(VerticalLayer.Middle, null)
      slice.set(VerticalLayer.Down1, new MazeBlock([new MazeObject(this.entityEmitter.emitEnsured())]))
    }
  }

  private removePole(slice: VerticalGrid3DSlice<MazeBlock>) {
    for(let layer = VerticalLayer.Up2; layer <= VerticalLayer.Middle; layer++) {
      if (slice.get(layer)?.objects.some(o => o.model.modelClass === 'pole')) {
        slice.set(layer, null)
      }
    }
  }
}
