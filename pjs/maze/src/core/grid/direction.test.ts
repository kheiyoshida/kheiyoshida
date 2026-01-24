import { Direction, rotated } from './direction.ts'

describe(`direction`, () => {
  test.each<[perspective: Direction, result: Direction[]]>([
    ['n', ['n', 'e', 's', 'w']],
    ['e', ['w', 'n', 'e', 's']],
    ['s', ['s', 'w', 'n', 'e']],
    ['w', ['e', 's', 'w', 'n']],
  ])(`${rotated.name} %o`, (perspective, [nResult, eResult, sResult, wResult]) => {
    expect(rotated('n', perspective)).toBe(nResult)
    expect(rotated('e', perspective)).toBe(eResult)
    expect(rotated('s', perspective)).toBe(sResult)
    expect(rotated('w', perspective)).toBe(wResult)
  })
})
