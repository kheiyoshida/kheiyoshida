import { makeSpeedConsumer } from './phyisics'

test(`${makeSpeedConsumer.name}`, () => {
  const consumeSpeed = makeSpeedConsumer(2, (s) => s - 4)
  const speed = 8
  const speed2 = consumeSpeed(speed)
  expect(speed2).toBeCloseTo(4)
  const speed3 = consumeSpeed(speed2)
  expect(speed3).toBeCloseTo(2)
})

