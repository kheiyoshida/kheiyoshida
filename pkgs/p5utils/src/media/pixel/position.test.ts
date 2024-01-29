import { leftTopIze, restrain, getRestrainedRegion } from './position'

test(`${getRestrainedRegion.name}`, () => {
  expect(
    getRestrainedRegion(
      {
        width: 1000,
        height: 500,
      },
      {
        width: 200,
        height: 100,
      }
    )
  ).toMatchObject({
    b: 450,
    l: 100,
    r: 900,
    t: 50,
  })
})

test(`${restrain.name}`, () => {
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

test(`${leftTopIze.name}`, () => {
  const position = { x: 985, y: 545 }
  const magnifiedSize = { width: 100, height: 50 }
  const leftTop = leftTopIze(position, magnifiedSize)
  expect(leftTop).toMatchObject({ x: 935, y: 520 })
})
