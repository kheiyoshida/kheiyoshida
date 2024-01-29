import * as utils from 'utils'
import * as source from './source'
import { makeVideoSupply } from './supply'
import { p5VideoElement } from './types'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils'),
}))

describe(`${makeVideoSupply.name}`, () => {
  it(`should create a supply`, () => {
    const sourceList = ['source_1', 'source_2']
    const mockVideoElements = sourceList.map(
      () =>
        ({
          speed: jest.fn(),
          play: jest.fn(),
          onended: jest.fn(),
          pause: jest.fn(),
        }) as unknown as p5VideoElement
    )
    jest.spyOn(source, 'loadVideoSourceList').mockReturnValue(mockVideoElements)
    jest.spyOn(source, 'waitForVideosToLoad').mockResolvedValue(true)
    jest
      .spyOn(utils, 'makeRandomItemPicker')
      .mockImplementationOnce((arr) => () => arr[0])
      .mockImplementationOnce((arr) => () => arr[1])
    const supply = makeVideoSupply(mockVideoElements, { speed: 0.1 })
    const video = supply.currentVideo
    expect(video).toBe(mockVideoElements[0])
    expect(video.speed).toHaveBeenCalledWith(0.1)
    expect(video.play).toHaveBeenCalled()

    supply.updateOptions({ speed: 0.2 })
    supply.swapVideo()
    const video2 = supply.currentVideo
    expect(video.pause).toHaveBeenCalled()
    expect(video2.speed).toHaveBeenCalledWith(0.2)
    expect(video2.play).toHaveBeenCalled()
  })
})