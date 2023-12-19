import { Delay, PolySynth } from "mgnr-tone/mgnr";
import { Mixer } from "./Mixer";
jest.mock('tone')

describe(`${Mixer}`, () => {
  test(`${Mixer.prototype.createInstChannel.name}`, () => {
    const mixer = new Mixer()
    mixer.createInstChannel({
      id: 'synth',
      inst: new PolySynth()
    })
    expect(mixer.channels.inst.synth).toBeDefined()
  })
  test(`${Mixer.prototype.createSendChannel.name}`, () => {
    const mixer = new Mixer()
    mixer.createSendChannel({
      id: 'delay',
      effects: [new Delay()]
    })
    expect(mixer.channels.sends.delay).toBeDefined()
  })
  test(`${Mixer.prototype.connectSendChannel.name}`, () => {
    const mixer = new Mixer()
    mixer.createInstChannel({
      id: 'synth',
      inst: new PolySynth()
    })
    mixer.createSendChannel({
      id: 'delay',
      effects: [new Delay()]
    })
    mixer.connectSendChannel('synth', 'delay', 1)
    expect(mixer.channels.inst.synth.sends.nodes.length).toBe(1)
  })
})