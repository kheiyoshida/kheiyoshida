import { restrain, restrainedRegion } from './magnify'

test(`restrainedRegion`, () => {
  expect(
    restrainedRegion(
      {
        width: 1000,
        height: 500,
      },
      {
        width: 200,
        height: 100,
      }
    )
  ).toMatchInlineSnapshot(`
    {
      "b": 450,
      "l": 100,
      "r": 900,
      "t": 50,
    }
  `)
})

test('restrain', () => {
  const r = {
    l: 400,
    r: 600,
    t: 200,
    b: 300,
  }
  expect(restrain(r, { x: 500, y: 250 })).toMatchObject({ x: 500, y: 250 })
  expect(restrain(r, { x: 300, y: 250 })).toMatchObject({ x: 400, y: 250 })
  expect(restrain(r, { x: 700, y: 250 })).toMatchObject({ x: 600, y: 250 })
  expect(restrain(r, { x: 500, y: 100 })).toMatchObject({ x: 500, y: 200 })
  expect(restrain(r, { x: 500, y: 400 })).toMatchObject({ x: 500, y: 300 })
})
