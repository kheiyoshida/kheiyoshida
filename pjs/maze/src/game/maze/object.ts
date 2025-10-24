
export class BlockObject {}

export type StairType = 'warp' | 'normal'
export class Stair extends BlockObject {
  constructor(readonly type: StairType) {
    super()
  }
}
