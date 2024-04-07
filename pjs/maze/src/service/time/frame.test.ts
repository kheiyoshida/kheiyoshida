import { makeFrameConsumer } from "./frame";

test(`${makeFrameConsumer.name}`, () => {
  const consumer = makeFrameConsumer()
  const handler = jest.fn()
  consumer.registerFrameEvent('constant', {
    frameInterval: 4,
    handler,
  })

  consumer.consumeFrame(1)
  expect(handler).not.toHaveBeenCalled()
  consumer.consumeFrame(2)
  expect(handler).not.toHaveBeenCalled()
  consumer.consumeFrame(3)
  expect(handler).not.toHaveBeenCalled()
  consumer.consumeFrame(4)
  expect(handler).toHaveBeenCalled()
})