import { ImageScope } from './scope'
import { MediaSize } from '../types'

describe(`${ImageScope.name}`, () => {
  const size: MediaSize = {
    width: 960,
    height: 540,
  }

  describe(`magnify`, () => {
    it(`should initialize`, () => {
      const scope = new ImageScope(size, 160)
      const params = scope.parseParams
      expect(params.scopeCenter).toMatchObject({ x: 480, y: 270 })
      expect(params.scopedSize).toMatchObject(size)
      expect(params.pixelSkip).toBe(960 / 160) // should skip 6 pixels to make it 160px wide
      expect(params.scopeCenter).toMatchObject({ x: 480, y: 270 })
    })

    it(`can change the magnification`, () => {
      const scope = new ImageScope(size, 160)
      scope.magnifyLevel = 2
      const params = scope.parseParams
      expect(params.scopeCenter).toMatchObject({ x: 480, y: 270 })
      expect(params.scopedSize).toMatchObject({ width: 480, height: 270 }) // 2x (=1/2 of original) size
      expect(params.pixelSkip).toBe(480 / 160)
      expect(params.scopeCenter).toMatchObject({ x: 480, y: 270 })
    })

    it(`should restraint the position when zoomed out`, () => {
      // arrange
      const scope = new ImageScope(size, 160)
      scope.magnifyLevel = 3
      expect(scope.parseParams.scopedSize).toMatchObject({ width: 320, height: 180 }) // 3x size
      const half = 320 / 2
      scope.position = { x: 960 - half, y: 270 }
      expect(scope.position).toEqual({ x: 960 - half, y: 270 })

      // act
      scope.magnifyLevel = 2
      expect(scope.parseParams.scopedSize).toMatchObject({ width: 480, height: 270 }) // 3x size
      expect(scope.position).toEqual({ x: 960 - 480 / 2, y: 270 })
    })
  })

  describe(`position`, () => {
    it(`position should be restrained`, () => {
      const scope = new ImageScope(size, 160)
      expect(scope.parseParams.scopeCenter).toMatchObject({ x: 480, y: 270 })

      scope.position = { x: scope.position.x + 2, y: scope.position.y + 2 }
      expect(scope.parseParams.scopeCenter).toMatchObject({ x: 480, y: 270 }) // restricted

      scope.magnifyLevel = 2
      scope.position = { x: scope.position.x + 2, y: scope.position.y + 2 }
      expect(scope.parseParams.scopeCenter).toMatchObject({ x: 482, y: 272 })
    })
  })
})
