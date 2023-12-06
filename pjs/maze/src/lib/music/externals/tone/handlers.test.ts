import * as Tone from 'tone'
import { handlers } from './handlers'
import * as Commands from './commands'
jest.mock('tone')

test('', () => {})

// describe(`setupInstChannel`, () => {
//   it(`should connect each node and assign to mixer`, () => {
//     const out = new ToneDestination()
//     const inst = new Tone.Synth()
//     const fx1 = new Tone.Delay()
//     const fx2 = new Tone.Filter()
//     const instConn = jest.spyOn(inst, 'connect')
//     const fx1Conn = jest.spyOn(fx1, 'connect')
//     const fx2Conn = jest.spyOn(fx2, 'connect')
//     const command = Commands.SetupInstChannel.create({
//       id: 'inst',
//       inst,
//       effects: [fx1, fx2],
//     })
//     handlers.setupInstChannel(command, out)
//     expect(instConn).toHaveBeenCalledWith(fx1)
//     expect(fx1Conn).toHaveBeenCalledWith(fx2)
//     expect(fx2Conn).toHaveBeenCalledWith(out.mixer.channels.master.channel.ch)
//     expect(out.mixer.channels.inst['inst'].inst).toMatchObject(inst)
//     expect(out.mixer.channels.inst['inst'].effects).toMatchObject([fx1, fx2])
//   })
// })

// describe(`setupSendChannel`, () => {
//   it(`should connect each node and master channel`, () => {
//     const out = new ToneDestination()
//     const fx1 = new Tone.Delay()
//     const fx2 = new Tone.Filter()
//     const fx1Conn = jest.spyOn(fx1, 'connect')
//     const fx2Conn = jest.spyOn(fx2, 'connect')
//     const command = Commands.SetupSendChannel.create({
//       id: 'send',
//       effects: [fx1, fx2],
//     })
//     handlers.setupSendChannel(command, out)
//     expect(fx1Conn).toHaveBeenCalledWith(fx2)
//     expect(fx2Conn).toHaveBeenCalledWith(out.mixer.channels.master.channel.ch)
//     expect(out.mixer.channels.sends['send'].effects).toMatchObject([fx1, fx2])
//   })
// })

// describe(`assignSendChannel`, () => {
//   it(`can connect to other send channel`, () => {
//     const out = new ToneDestination()
//     const inst = new Tone.Synth()
//     const fx1 = new Tone.Delay()
//     const fx2 = new Tone.Filter()

//     const command = Commands.SetupInstChannel.create({
//       id: 'inst',
//       inst,
//     })
//     handlers.setupInstChannel(command, out)

//     const command2 = Commands.SetupSendChannel.create({
//       id: 'send',
//       effects: [fx1, fx2],
//     })
//     handlers.setupSendChannel(command2, out)

//     const command3 = Commands.AssignSendChannel.create({
//       from: 'inst',
//       to: 'send',
//       gainAmount: 0,
//     })
//   })
// })
