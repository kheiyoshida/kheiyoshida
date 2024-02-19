import { makeSwipeTracker, normalizeInputValues } from './normalize'

test(`${makeSwipeTracker.name}`, () => {
  const tracker = makeSwipeTracker(400)
  tracker.startSwipe({ x: 400, y: 800 })
  const values = tracker.getNormalizedValues({ x: 420, y: 850 })
  expect(values).toMatchObject({ x: 0.05, y: 0.125 })
})

test.each([
  [900, 600, 0, 0],
  [1500, 600, 0.5, 0],
  [900, 1200, 0, 0.5],
  [0, 200, -0.75, -0.33],
])(`${normalizeInputValues.name} (%i, %i)`, (x, y, levelX, levelY) => {
  const center = { x: 900, y: 600 }
  const oneEquivalent = 1200
  const normalized = normalizeInputValues({ x, y }, center, oneEquivalent)
  expect(normalized.x).toBeCloseTo(levelX)
  expect(normalized.y).toBeCloseTo(levelY)
})
