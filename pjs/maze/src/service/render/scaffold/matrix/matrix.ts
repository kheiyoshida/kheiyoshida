import { MatrixLayer } from './layer.ts'
import { TotalViewY, ViewPosition } from '../../../../integration/query/structure/view/view.ts'
import { DeformedBox } from 'maze-gl'

const NumOfLayers = TotalViewY + 1 // 6

export abstract class ScaffoldMatrix {
  protected layers: MatrixLayer[] = []

  public getBox(viewPosition: ViewPosition): DeformedBox {
    const t = 2 - viewPosition.y
    const b = 2 - viewPosition.y + 1
    const top = this.layers[t].getRect(viewPosition)
    const bottom = this.layers[b].getRect(viewPosition)
    return {
      FTL: top.fl,
      FTR: top.fr,
      BTL: top.bl,
      BTR: top.br,
      FBL: bottom.fl,
      FBR: bottom.fr,
      BBL: bottom.bl,
      BBR: bottom.br,
    }
  }
}

export class ScaffoldPointMatrix extends ScaffoldMatrix {
  constructor(floorLength: number, pathLength: number, wallLength: number) {
    super()
    const yValues = getYValues(wallLength)
    for(let y = 0; y < NumOfLayers; y++) {
      this.layers.push(new MatrixLayer(yValues[y], floorLength, pathLength))
    }
  }
}

const getYValues = (wallLength: number) => [
  wallLength / 2 + wallLength * 2,
  wallLength / 2 + wallLength,
  wallLength / 2,
  -wallLength / 2,
  -wallLength / 2 - wallLength,
  -wallLength / 2 - wallLength * 2,
]
