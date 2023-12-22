import {
  EventThresholdFrameNumber1,
  EventThresholdFrameNumber2,
  EventThresholdFrameNumber3,
  LoudThreshold,
  SilentThreshold,
} from '../constants'
import { resolveEvents } from './attitudeEvents'
import { CommandGrid } from './commandGrid'

const mockCommandGrid = () => ({
  1: {
    silent: jest.fn(),
    neutral: jest.fn(),
    loud: jest.fn(),
    common: jest.fn(),
  },
  2: {
    silent: jest.fn(),
    neutral: jest.fn(),
    loud: jest.fn(),
    common: jest.fn(),
  },
  3: {
    silent: jest.fn(),
    neutral: jest.fn(),
    loud: jest.fn(),
    common: jest.fn(),
  },
})

describe(`${resolveEvents.name}`, () => {
  const commandGrid: CommandGrid = mockCommandGrid()

  beforeEach(() => {
    jest.resetAllMocks()
  })
  it.each`
    frames                            | roomVar                | handler
    ${EventThresholdFrameNumber1}     | ${SilentThreshold}     | ${commandGrid[1].silent}
    ${EventThresholdFrameNumber1}     | ${SilentThreshold + 1} | ${commandGrid[1].neutral}
    ${EventThresholdFrameNumber1}     | ${LoudThreshold}       | ${commandGrid[1].loud}
    ${EventThresholdFrameNumber1 * 2} | ${SilentThreshold}     | ${commandGrid[1].silent}
    ${EventThresholdFrameNumber1}     | ${LoudThreshold}       | ${commandGrid[1].common}
    ${EventThresholdFrameNumber2}     | ${SilentThreshold}     | ${commandGrid[2].silent}
    ${EventThresholdFrameNumber2}     | ${SilentThreshold + 1} | ${commandGrid[2].neutral}
    ${EventThresholdFrameNumber2}     | ${LoudThreshold}       | ${commandGrid[2].loud}
    ${EventThresholdFrameNumber3}     | ${SilentThreshold}     | ${commandGrid[3].silent}
    ${EventThresholdFrameNumber3}     | ${SilentThreshold + 1} | ${commandGrid[3].neutral}
    ${EventThresholdFrameNumber3}     | ${LoudThreshold}       | ${commandGrid[3].loud}
  `(
    `should run the matching event handler from provided command grid`,
    ({ roomVar, frames, handler }) => {
      resolveEvents(roomVar, commandGrid)(frames)
      expect(handler).toHaveBeenCalledWith(roomVar)
    }
  )
})
