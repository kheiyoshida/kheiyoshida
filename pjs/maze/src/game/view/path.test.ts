import { Block } from '../../core/level/legacy/block.ts'
import { toPathSpec } from './path.ts'

describe(`${toPathSpec.name}`, () => {
  it(`should convert node path to PathSpec`, () => {
    const path: Block[] = [
      new Block([3, 0], { n: true, e: true }), // z=0
      new Block([2, 0], { n: true, w: true }), // z=1
      new Block([1, 0], { e: true }), // z=2
    ]
    expect(toPathSpec(path, 'n')).toMatchObject([
      {
        stair: null,
        terrain: {
          left: 'wall',
          front: 'corridor',
          right: 'corridor',
        },
      },
      {
        stair: null,
        terrain: {
          left: 'corridor',
          front: 'corridor',
          right: 'wall',
        },
      },
      {
        stair: null,
        terrain: {
          left: 'wall',
          front: 'wall',
          right: 'corridor',
        },
      },
    ])
  })
  it(`should fill with null if front node isn't approachable`, () => {
    const path: Block[] = [
      new Block([3, 0], { n: true, e: true }), // z=0
      new Block([2, 0], { n: true }), // z=1
    ]
    expect(toPathSpec(path, 'n')).toMatchObject([
      {
        stair: null,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'corridor',
        },
      },
      {
        stair: null,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'wall',
        },
      },
      null,
    ])
  })
})
