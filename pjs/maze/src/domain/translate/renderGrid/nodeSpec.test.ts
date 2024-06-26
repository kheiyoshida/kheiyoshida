import { Node } from '../../../store/entities/matrix/node'
import { toNodeSpec, toPathSpec } from './nodeSpec'

describe(`toNodeSpec`, () => {
  it(`should emit rendeirng spec based on direction`, () => {
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

  it(`should convert node path to PathSpec`, () => {
    const path: Node[] = [
      new Node([3, 0], { n: true, e: true }),
      new Node([2, 0], { n: true }),
      new Node([1, 0], { n: true }),
    ]
    expect(toPathSpec('n')(path)).toMatchObject([
      {
        stair: false,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'wall',
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
      {
        stair: false,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'corridor',
        },
      },
    ])
  })
  it(`should fill with null if front node isn't approachable`, () => {
    const path: Node[] = [new Node([3, 0], { n: true, e: true }), new Node([2, 0], { n: true })]
    expect(toPathSpec('n')(path)).toMatchObject([
      null,
      {
        stair: false,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'wall',
        },
      },
      {
        stair: false,
        terrain: {
          front: 'corridor',
          left: 'wall',
          right: 'corridor',
        },
      },
    ])
  })
})
