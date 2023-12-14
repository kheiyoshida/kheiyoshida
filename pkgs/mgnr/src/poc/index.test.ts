import { Generator } from '../generator/Generator'
import { assignGeneratorToChannel, createGenerator, createInstChannel, createInstrument } from './index'

test(`client can create generator`, () => {
  const generator = createGenerator()
  expect(generator).toBeInstanceOf(Generator)
})

test(`client can start music and hear the generated sequences`, () => {
  // create an app
})
