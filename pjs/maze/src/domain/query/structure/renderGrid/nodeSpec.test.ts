import { Node } from '../../../../store/entities/matrix/node.ts'
import { toNodeSpec, toPathSpec } from './nodeSpec.ts'

describe(`${toNodeSpec.name}`, () => {
  it(`should emit rendering spec based on direction`, () => {
    const node = new Node([0, 0], { n: true })
    expect(toNodeSpec('n')(node).terrain).toMatchObject({
      left: 'wall',
      right: 'wall',
      front: 'corridor',
    })
    expect(toNodeSpec('e')(node).terrain).toMatchObject({
      left: 'corridor',
      right: 'wall',
      front: 'wall',
    })
    expect(toNodeSpec('s')(node).terrain).toMatchObject({
      left: 'wall',
      right: 'wall',
      front: 'wall',
    })
    expect(toNodeSpec('w')(node).terrain).toMatchObject({
      left: 'wall',
      right: 'corridor',
      front: 'wall',
    })
  })

  it(`should include stair flag if node is on the stair`, () => {
    const node = new Node([0, 0], { n: true })
    node.setStair()
    expect(toNodeSpec('n')(node).stair).toBe(true)
  })
})

describe(`${toPathSpec.name}`, () => {
  it(`should convert node path to PathSpec`, () => {
    const path: Node[] = [
      new Node([3, 0], { n: true, e: true }), // z=0
      new Node([2, 0], { n: true, w: true }), // z=1
      new Node([1, 0], { e: true }), // z=2
    ]
    expect(toPathSpec('n')(path)).toMatchObject([
      {
        stair: false,
        terrain: {
          left: 'wall',
          front: 'corridor',
          right: 'corridor',
        },
      },
      {
        stair: false,
        terrain: {
          left: 'corridor',
          front: 'corridor',
          right: 'wall',
        },
      },
      {
        stair: false,
        terrain: {
          left: 'wall',
          front: 'wall',
          right: 'corridor',
        },
      },
    ])
  })
  it(`should fill with null if front node isn't approachable`, () => {
    const path: Node[] = [
      new Node([3, 0], { n: true, e: true }), // z=0
      new Node([2, 0], { n: true }), // z=1
    ]
    expect(toPathSpec('n')(path)).toMatchObject([
      {
        stair: false,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'corridor',
        },
      },
      {
        stair: false,
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
