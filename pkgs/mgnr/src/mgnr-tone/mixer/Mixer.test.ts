import { Delay, PolySynth } from 'tone'
import { Mixer } from './Mixer'
jest.mock('tone')

describe(`${Mixer}`, () => {
  test(`${Mixer.prototype.createInstChannel.name}`, () => {
    const mixer = new Mixer()
    const ch = mixer.createInstChannel({
      id: 'synth',
      inst: new PolySynth(),
    })
    expect(mixer.channels.includes(ch)).toBe(true)
  })
  test(`${Mixer.prototype.createSendChannel.name}`, () => {
    const mixer = new Mixer()
    const ch = mixer.createSendChannel({
      id: 'delay',
      effects: [new Delay()],
    })
    expect(mixer.channels.includes(ch)).toBe(true)
  })
  test(`${Mixer.prototype.connectSendChannel.name}`, () => {
    const mixer = new Mixer()
    const synCh = mixer.createInstChannel({
      id: 'synth',
      inst: new PolySynth(),
    })
    const delayCh = mixer.createSendChannel({
      id: 'delay',
      effects: [new Delay()],
    })
    mixer.connectSendChannel(synCh, delayCh, 1)
    expect(synCh.sends.nodes.length).toBe(1)
  })
})
