import { buildCommandGrid } from "./commandGrid";

test(`${buildCommandGrid.name}`, () => {
  const fn = jest.fn()
  const result = buildCommandGrid({
    silent: {
      1: fn
    }
  })
  expect(result.silent[1]).toBe(fn)
  expect(result.common[1]).toBeInstanceOf(Function)
})