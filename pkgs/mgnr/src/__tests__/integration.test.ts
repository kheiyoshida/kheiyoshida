import * as TONE_COMMANDS from '../externals/tone/commands'
import { PolySynth } from 'tone'
import { Musician } from '../Musician'
import { Scale } from '../generator/Scale'
import {} from '../externals/tone/tone-wrapper/Transport'
jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('../externals/tone/tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../externals/tone/tone-wrapper/Transport')>(
    '../externals/tone/tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
}))

describe(`old implementation`, () => {
  test(`client code can set up compoenents and assign sequence to instrument`, () => {
    // bind handlers
    Musician.init()

    
    TONE_COMMANDS.SetupInstChannel.create({
      conf: {
        id: '',
        inst: new PolySynth(),
      },
    })

    const key = 'C'
    const scale = new Scale({ key })

    const inst = new PolySynth()
    const channelId = 'instCh'
    TONE_COMMANDS.SetupInstChannel.pub({
      conf: {
        id: channelId,
        inst,
      },
    })

    TONE_COMMANDS.AssignGenerator.pub({
      channelId,
      loop: 4,
      conf: {
        scale,
        length: 4,
        division: 16,
        fillStrategy: 'fixed',
      },
      notes: {
        0: [
          {
            vel: 100,
            dur: 1,
            pitch: 60,
          },
        ],
      },
    })
  })
})
