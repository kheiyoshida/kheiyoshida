import * as Tone from 'tone'
import { getMixer } from '../commands'
import { makeFader } from './fade'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('../tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../tone-wrapper/Transport')>(
    '../tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
  scheduleOnce: (cb: (time: number) => void, time: number) => {
    cb(time)
  },
}))

test(`${makeFader.name}`, () => {
  const mixer = getMixer()
  const synCh = mixer.createInstChannel({
    inst: new Tone.MonoSynth(),
  })
  const channels = {
    synth: synCh
  }
  jest.spyOn(synCh, 'dynamicVolumeFade').mockImplementation(() => undefined)
  const fade = makeFader(channels)
  fade({ in: { top: 'synth' }, out: {} }, 'up')
  expect(channels.synth.dynamicVolumeFade).toHaveBeenCalledTimes(1)
})
