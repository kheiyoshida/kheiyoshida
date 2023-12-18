import { ToneDestination } from './Destination'
import { ToneMusicGenerator } from './MusicGenerator'
import { Mixer } from './mixer/Mixer'
jest.mock('tone')

jest.mock('./tone-wrapper/Transport')

const prepareMgnr = () => {
  const dest = new ToneDestination()
  const mgnr = new ToneMusicGenerator(dest)
  return { mgnr, dest }
}

describe(`${ToneMusicGenerator.name}`, () => {
  test(`${ToneMusicGenerator.prototype.createMixer.name}`, () => {
    const { mgnr } = prepareMgnr()
    expect(mgnr.createMixer() instanceof Mixer).toBe(true)
  })

  test(`${ToneMusicGenerator.prototype.assignSendChannel.name}`, () => {
    const {
      mgnr,
      dest: { mixer },
    } = prepareMgnr()
    const spyConnectSendCh = jest.spyOn(mixer, 'connectSendChannel').mockReturnValue()
    mgnr.assignSendChannel('synth', 'delay', 0.5)
    expect(spyConnectSendCh).toHaveBeenCalled()
  })
  test(`${ToneMusicGenerator.prototype.registerTimeEvents.name}`, () => {
    const {
      mgnr,
      dest: { timeObserver },
    } = prepareMgnr()
    const spyRegister = jest.spyOn(timeObserver, 'registerEvents')
    mgnr.registerTimeEvents({
      once: [
        {
          time: '2:0:0',
          handler: () => undefined,
        },
      ],
    })
    expect(spyRegister).toHaveBeenCalled()
  })

})
