import { createPitchNameListInScale, getSemitoneDiffBetweenPitches } from "./utils"

describe('makeToneList', () => {
  it('can make ToneName list from scale constructor', () => {
    const res = createPitchNameListInScale('D', 'major')
    expect(res.length).toBe(7)
    expect(res).toMatchObject(['D', 'E', 'F#', 'G', 'A', 'B', 'C#'])
  })
})

describe('keyDiff', () => {
  it('should be able to calculate degree of note from the provided root', () => {
    expect(getSemitoneDiffBetweenPitches('D#', 'F#')).toBe(3)
    expect(getSemitoneDiffBetweenPitches('A', 'C')).toBe(3)
    expect(getSemitoneDiffBetweenPitches('B', 'C')).toBe(1)
    expect(getSemitoneDiffBetweenPitches('C', 'B')).toBe(11)
  })
})