import { createGenerator } from './Context'

test(`${createGenerator.name}`, () => {
  const generator = createGenerator(
    {
      config: {
        foo: 2,
      },
    },
    {
      increment: (ctx, amount: number) => {
        ctx.config.foo += amount
      },
    }
  )

  generator.increment(3)
  expect(generator.config.foo).toBe(5)
  generator.increment(2)
  expect(generator.config.foo).toBe(7)
})
