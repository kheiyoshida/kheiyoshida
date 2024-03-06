import { createRandomSelect, mapPercentage, ratioToPercentage } from './random'

describe(`randomSelect`, () => {
  it(`can turn ratio to pecentage`, () => {
    expect(
      ratioToPercentage([
        [3, 'A'],
        [2, 'B'],
        [5, 'C'],
      ])
    ).toMatchObject([
      [0.3, 'A'],
      [0.2, 'B'],
      [0.5, 'C'],
    ])
  })
  it(`can turn percentages to mapped pecentages`, () => {
    expect(
      mapPercentage([
        [0.3, 'A'],
        [0.2, 'B'],
        [0.5, 'C'],
      ])
    ).toMatchObject([
      [0.3, 'A'],
      [0.5, 'B'],
      [1.0, 'C'],
    ])
  })

  it(`can select randomly`, () => {
    const mathRandom = jest.spyOn(Math, 'random')
    mathRandom.mockReturnValue(0.2)
    expect(
      createRandomSelect([
        [3, 'A'],
        [2, 'B'],
        [5, 'C'],
      ])()
    ).toBe('A')

    mathRandom.mockReturnValue(1)
    expect(
      createRandomSelect([
        [30, 'A'],
        [18, 'B'],
        [60, 'C'],
      ])()
    ).toBe('C')

    mathRandom.mockClear()
  })
})
