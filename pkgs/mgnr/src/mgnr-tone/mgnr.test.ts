import * as mgnr from './mgnr'
import { Mixer } from './mixer/Mixer'
jest.mock('tone')

jest.mock('./tone-wrapper/Transport')

test(`${mgnr.createMixer.name}`, () => {
  expect(mgnr.createMixer() instanceof Mixer).toBe(true)
})
