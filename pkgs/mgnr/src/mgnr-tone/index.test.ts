import { ToneMusicGenerator } from '.'
import { Mixer } from './mixer/Mixer'
jest.mock('tone')

jest.mock('./tone-wrapper/Transport')

const prepareMgnr = () => {
  const mgnr = new ToneMusicGenerator()
  return { mgnr }
}

describe(`${ToneMusicGenerator.name}`, () => {
  test(`${ToneMusicGenerator.prototype.createMixer.name}`, () => {
    const { mgnr } = prepareMgnr()
    expect(mgnr.createMixer() instanceof Mixer).toBe(true)
  })
})
