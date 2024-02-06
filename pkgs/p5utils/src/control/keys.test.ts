import { registerKeys } from './keys'

test(`${registerKeys.name}`, () => {
  jest.spyOn(p, 'keyIsDown').mockImplementation((k) => k === 32 || k === 35)
  const detectKeys = registerKeys([30, 32, 33, 35])
  const keys = detectKeys()
  expect(keys).toMatchObject([32, 35])
})
