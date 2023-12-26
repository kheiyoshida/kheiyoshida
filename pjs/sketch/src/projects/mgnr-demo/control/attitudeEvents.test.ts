import {
  EventThresholdFrameNumber1,
  EventThresholdFrameNumber2,
  EventThresholdFrameNumber3,
  LoudThreshold,
  SilentThreshold,
} from '../constants'
import { resolveEvents } from './attitudeEvents'
import { CommandGrid } from './commandGrid'

const commandGrid: CommandGrid = {
  silent: {
    1: jest.fn(),
    2: jest.fn(),
    3: jest.fn(),
    4: jest.fn(),
    5: jest.fn()
  },
  loud: {
    1: jest.fn(),
    2: jest.fn(),
    3: jest.fn(),
    4: jest.fn(),
    5: jest.fn()
  },
  common: {
    1: jest.fn(),
    2: jest.fn(),
    3: jest.fn(),
    4: jest.fn(),
    5: jest.fn()
  },
  neutral: {
    1: jest.fn(),
    2: jest.fn(),
    3: jest.fn(),
    4: jest.fn(),
    5: jest.fn()
  },
}

describe(`${resolveEvents.name}`, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it.each`
    roomVar                | frames                        | handler
    ${SilentThreshold}     | ${EventThresholdFrameNumber1} | ${commandGrid.silent[1]}
    ${SilentThreshold}     | ${EventThresholdFrameNumber2} | ${commandGrid.silent[2]}
    ${SilentThreshold}     | ${EventThresholdFrameNumber3} | ${commandGrid.silent[3]}
    ${SilentThreshold}     | ${EventThresholdFrameNumber1} | ${commandGrid.common[1]}
    ${SilentThreshold}     | ${EventThresholdFrameNumber2} | ${commandGrid.common[2]}
    ${SilentThreshold}     | ${EventThresholdFrameNumber3} | ${commandGrid.common[3]}
    ${SilentThreshold + 1} | ${EventThresholdFrameNumber1} | ${commandGrid.neutral[1]}
    ${SilentThreshold + 1} | ${EventThresholdFrameNumber2} | ${commandGrid.neutral[2]}
    ${SilentThreshold + 1} | ${EventThresholdFrameNumber3} | ${commandGrid.neutral[3]}
    ${LoudThreshold}       | ${EventThresholdFrameNumber1} | ${commandGrid.loud[1]}
    ${LoudThreshold}       | ${EventThresholdFrameNumber2} | ${commandGrid.loud[2]}
    ${LoudThreshold}       | ${EventThresholdFrameNumber3} | ${commandGrid.loud[3]}
  `(
    `should run the matching event handler from provided command grid`,
    ({ roomVar, frames, handler }) => {
      resolveEvents(roomVar, commandGrid)(frames)
      expect(handler).toHaveBeenCalledWith(roomVar)
    }
  )
})
