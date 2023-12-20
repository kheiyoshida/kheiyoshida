import { Delay, PolySynth } from 'tone'
import { Mixer } from './Mixer'
jest.mock('tone')

describe(`${Mixer}`, () => {
  test(`${Mixer.prototype.createInstChannel.name}`, () => {
    const mixer = new Mixer()
    const ch = mixer.createInstChannel({
      inst: new PolySynth(),
      effects: [],
    })
    expect(mixer.channels.includes(ch)).toBe(true)
  })
  test(`${Mixer.prototype.createSendChannel.name}`, () => {
    const mixer = new Mixer()
    const ch = mixer.createSendChannel({
      effects: [new Delay()],
    })
    expect(mixer.channels.includes(ch)).toBe(true)
  })
  test(`${Mixer.prototype.connect.name}`, () => {
    const mixer = new Mixer()
    const synCh = mixer.createInstChannel({
      inst: new PolySynth(),
      effects: [],
    })
    const delayCh = mixer.createSendChannel({
      effects: [new Delay()],
    })
    mixer.connect(synCh, delayCh, 1)
    expect(synCh.sends.nodes.length).toBe(1)
  })
})
