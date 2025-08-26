import { ImageScope } from './scope'

describe(`${ImageScope.name}`, () => {
  const size = {
    width: 960,
    height: 540,
  }
  describe(`magnify`, () => {
    it(`should initialize`, () => {
      const selector = new ImageScope(size, 160)
      const option = selector.parseParams
      expect(option.scopeCenter).toMatchObject({ x: 480, y: 270 })
      expect(option.scopedSize).toMatchObject(size)
      expect(option.pixelSkip).toBe(960 / 160) // should skip 6 pixels to make it 160px wide
      expect(option.scopeCenter).toMatchObject({ x: 480, y: 270 })
    })
    it(`can change the magnification`, () => {
      const selector = new ImageScope(size, 160)
      selector.magnifyLevel = 2
      const option = selector.parseParams
      expect(option.scopeCenter).toMatchObject({ x: 480, y: 270 })
      expect(option.scopedSize).toMatchObject({ width: 480, height: 270 }) // 2x (=1/2 of original) size
      expect(option.pixelSkip).toBe(480 / 160)
      expect(option.scopeCenter).toMatchObject({ x: 480, y: 270 })
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
