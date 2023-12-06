import { makeToneList, keyDiff } from "./utils"

describe('makeToneList', () => {
  it('can make ToneName list from scale constructor', () => {
    const res = makeToneList('D', 'major')
    expect(res.length).toBe(7)
    expect(res).toMatchObject(['D', 'E', 'F#', 'G', 'A', 'B', 'C#'])
  })
})

describe('keyDiff', () => {
  it('should be able to calculate degree of note from the provided root', () => {
    expect(keyDiff('D#', 'F#')).toBe(3)
    expect(keyDiff('A', 'C')).toBe(3)
    expect(keyDiff('B', 'C')).toBe(1)
    expect(keyDiff('C', 'B')).toBe(11)
  })
})