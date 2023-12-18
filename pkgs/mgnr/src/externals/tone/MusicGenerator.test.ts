import { Delay, PolySynth } from 'tone'
import { ToneDestination } from './Destination'
import { ToneMusicGenerator } from './MusicGenerator'
import { Scale } from '../../generator/Scale'
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
  test(`${ToneMusicGenerator.prototype.assignGenerator.name}`, () => {
    const {
      mgnr,
      dest: { output },
    } = prepareMgnr()
    mgnr.setupInstChannel({
      id: 'synth',
      inst: new PolySynth(),
      initialVolume: -10,
    })
    mgnr.assignGenerator({
      channelId: 'synth',
      loop: 4,
      conf: {
        fillPref: 'mono',
        scale: new Scale({ key: 'D' }),
      },
    })
    expect(output.outs['synth']).not.toBeUndefined()
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
  test(`${ToneMusicGenerator.prototype.fadeChannel.name}`, () => {
    const {
      mgnr,
      dest: { mixer },
    } = prepareMgnr()
    mgnr.setupInstChannel({
      id: 'synth',
      inst: new PolySynth(),
    })
    const ch = mixer.channels.inst['synth']
    const spyFade = jest.spyOn(ch, 'volumeFade').mockImplementation()
    mgnr.fadeChannel('synth', [-20, '4m', '+4m'])
    expect(spyFade).toHaveBeenCalled()
  })
  test(`${ToneMusicGenerator.prototype.muteChannel.name}`, () => {
    const {
      mgnr,
      dest: { mixer },
    } = prepareMgnr()
    mgnr.setupInstChannel({
      id: 'synth',
      inst: new PolySynth(),
    })
    const ch = mixer.channels.inst['synth']
    const spyMute = jest.spyOn(ch, 'mute').mockImplementation()
    mgnr.muteChannel('synth', 'off')
    expect(spyMute).toHaveBeenCalled()
  })
  test(`${ToneMusicGenerator.prototype.sendFade.name}`, () => {
    const {
      mgnr,
      dest: { mixer },
    } = prepareMgnr()
    const spyFade = jest.spyOn(mixer, 'fadeChannelSend').mockImplementation()
    mgnr.sendFade('synth', 'delay', [1.5, '4m', '+4m'])
    expect(spyFade).toHaveBeenCalled()
  })
  test(`${ToneMusicGenerator.prototype.sendMute.name}`, () => {
    const {
      mgnr,
      dest: { mixer },
    } = prepareMgnr()
    const spyMute = jest.spyOn(mixer, 'muteChannelSend').mockImplementation()
    mgnr.sendMute('synth', 'delay', 'off')
    expect(spyMute).toHaveBeenCalled()
  })
  test(`${ToneMusicGenerator.prototype.disposeChannel.name}`, () => {
    const { mgnr } = prepareMgnr()
    mgnr.setupInstChannel({ id: 'synth', inst: new PolySynth() })
    const spyDelete = jest.spyOn(mgnr, 'deleteChannel').mockImplementation()
    const spyDispose = jest.spyOn(mgnr, 'disposeSequenceOut').mockImplementation()
    mgnr.disposeChannel('synth')
    expect(spyDelete).toHaveBeenCalled()
    expect(spyDispose).toHaveBeenCalled()
  })
  test(`${ToneMusicGenerator.prototype.deleteChannel.name}`, () => {
    const {
      mgnr,
      dest: { mixer },
    } = prepareMgnr()
    const spyDelete = jest.spyOn(mixer, 'deleteChannel').mockImplementation()
    mgnr.deleteChannel('synth')
    expect(spyDelete).toHaveBeenCalled()
  })
})
