export const mockP5variable = (prop: keyof typeof p, value: unknown) => {
  Object.defineProperty(p, prop, {
    configurable: true,
    get: jest.fn(() => value),
  })
}