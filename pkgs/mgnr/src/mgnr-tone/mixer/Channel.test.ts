import * as Tone from 'mgnr-tone/commands'
import { InstChannel, SendChannel } from './Channel'
jest.mock('tone')

describe(`Channel`, () => {
  it(`should connect all the nodes provided`, () => {
    const inst = new Tone.Synth()
    const fx1 = new Tone.Filter()
    const fx2 = new Tone.Delay()
    const instConn = jest.spyOn(inst, 'connect')
    const fx1Conn = jest.spyOn(fx1, 'connect')
    const fx2Conn = jest.spyOn(fx2, 'connect')
    new InstChannel({
      inst,
      effects: [fx1, fx2],
    })
    expect(instConn).toHaveBeenCalledWith(fx1)
    expect(fx1Conn).toHaveBeenCalledWith(fx2)
    expect(fx2Conn).toHaveBeenCalledWith(expect.any(Object)) // Volume
  })
  it(`should connect all the nodes provided`, () => {
    const fx1 = new Tone.Filter()
    const fx2 = new Tone.Delay()
    const fx1Conn = jest.spyOn(fx1, 'connect')
    const fx2Conn = jest.spyOn(fx2, 'connect')
    new SendChannel({
      effects: [fx1, fx2],
    })
    expect(fx1Conn).toHaveBeenCalledWith(fx2)
    expect(fx2Conn).toHaveBeenCalledWith(expect.any(Object)) // Volume
  })
})
