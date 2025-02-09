import * as Tone from 'tone'
import { getMixer } from '../commands'
import { DirectionDurationMap, makeFader } from './fade'
import * as Transport from '../tone-wrapper/Transport'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('../tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../tone-wrapper/Transport')>('../tone-wrapper/Transport'),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,

  // call callback immediately for testing
  scheduleOnce: (cb: (time: number) => void, time: number) => {
    cb(time)
  },
}))

afterEach(jest.clearAllMocks)

describe(`${makeFader.name}`, () => {
  it(`should fade in with defined duration`, () => {
    const mixer = getMixer()
    const synCh = mixer.createInstChannel({
      inst: new Tone.MonoSynth(),
    })
    const synCh2 = mixer.createInstChannel({
      inst: new Tone.MonoSynth(),
    })

    const channels = {
      synth: synCh,
      synth2: synCh2,
    }

    jest.spyOn(Transport, 'scheduleOnce')
    jest.spyOn(synCh, 'dynamicVolumeFade').mockImplementation(() => undefined)
    jest.spyOn(synCh2, 'dynamicVolumeFade').mockImplementation(() => undefined)

    const durationMap: DirectionDurationMap = {
      inDirection: '24m',
      againstDirection: '12m',
      neutral: '16m',
    }
    const [timing, delay] = ['@4m', '4m']
    const fade = makeFader(channels, durationMap, timing, delay)

    // move to up + inst on top = "in direction" fade in
    fade({ in: { top: 'synth', bottom: 'synth2' }, out: {} }, 'up')

    // scheduleOnce to schedule
    expect(Transport.scheduleOnce).toHaveBeenCalledWith(expect.any(Function), timing)

    // schedule fade in
    expect(Transport.scheduleOnce).toHaveBeenCalledWith(expect.any(Function), timing + Transport.toSeconds(delay))

    // scheduled fade
    expect(channels.synth.dynamicVolumeFade).toHaveBeenCalledWith(expect.any(Number), durationMap.inDirection)
    expect(channels.synth2.dynamicVolumeFade).toHaveBeenCalledWith(expect.any(Number), durationMap.againstDirection)
  })

  it(`should fade out with defined duration`, () => {
    const mixer = getMixer()
    const synCh = mixer.createInstChannel({
      inst: new Tone.MonoSynth(),
    })
    const synCh2 = mixer.createInstChannel({
      inst: new Tone.MonoSynth(),
    })

    const channels = {
      synth: synCh,
      synth2: synCh2,
    }

    jest.spyOn(Transport, 'scheduleOnce')
    jest.spyOn(synCh, 'dynamicVolumeFade').mockImplementation(() => undefined)
    jest.spyOn(synCh2, 'dynamicVolumeFade').mockImplementation(() => undefined)

    const durationMap: DirectionDurationMap = {
      inDirection: '24m',
      againstDirection: '12m',
      neutral: '16m',
    }
    const [timing, delay] = ['@4m', '4m']
    const fade = makeFader(channels, durationMap, timing, delay)

    // move to up + inst on top = "in direction" fade out
    fade({ out: { top: 'synth', bottom: 'synth2' }, in: {} }, 'up')

    // scheduleOnce to schedule
    expect(Transport.scheduleOnce).toHaveBeenCalledWith(expect.any(Function), timing)

    // schedule fade in
    expect(Transport.scheduleOnce).toHaveBeenCalledWith(expect.any(Function), timing + Transport.toSeconds(delay))

    // scheduled fade
    expect(channels.synth.dynamicVolumeFade).toHaveBeenCalledWith(expect.any(Number), durationMap.inDirection)
    expect(channels.synth2.dynamicVolumeFade).toHaveBeenCalledWith(expect.any(Number), durationMap.againstDirection)
  })
})
