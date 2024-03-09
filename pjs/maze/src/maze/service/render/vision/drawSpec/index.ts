import { VisionStrategy } from '../../../../domain/vision/strategy'
import { finalizer as floor } from './entity/floor/entities'
import { finalizer as highWall } from './entity/highWall/entities'
import { finalizer as wall } from './entity/wall/entities'
import { FinalizeDrawSpecs } from './finalize'

export const FinalizerMap: Record<VisionStrategy, FinalizeDrawSpecs> = {
  [VisionStrategy.normal]: wall,
  [VisionStrategy.highWall]: highWall,
  [VisionStrategy.floor]: floor,
}
