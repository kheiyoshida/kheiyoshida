import { ScreenEffect, ScreenShader } from 'maze-gl'
import { ConcreteScreenEffectParams } from './params.ts'

import vert from './shaders/screen.vert?raw'

import fragAtmospheric from './shaders/atmospheric.frag?raw'
import fragSmooth from './shaders/smooth.frag?raw'
import fragAmbient from './shaders/ambient.frag?raw'
import fragDigital from './shaders/digital.frag?raw'
import fragEdge from './shaders/abstract.frag?raw'
import { logicalHeight, logicalWidth } from '../../../../config'

const defaultParams: ConcreteScreenEffectParams = {
  resolution: [logicalWidth, logicalHeight, 0],
  baseColor: [0, 0, 0],
  fadeoutPercentage: 0.1,
  blurLevel: 0,
  pixelRandomizationLevel: 0,
  edgeRenderingIntensityLevel: 0,
}

export class MazeScreenEffect extends ScreenEffect<ConcreteScreenEffectParams> {
  protected constructor(shader: ScreenShader) {
    super(shader, defaultParams)
  }

  applyParameters(): void {
    this.screenShader.setUniformFloat('uTime', performance.now())
    this.screenShader.setUniformVec3('uResolution', this.effectParams.resolution)
    this.screenShader.setUniformVec3('uBaseColor', this.effectParams.baseColor)
    this.screenShader.setUniformFloat('uFadeoutPercentage', this.effectParams.fadeoutPercentage)
  }
}

export class AtmosphericEffect extends MazeScreenEffect {
  constructor() {
    super(new ScreenShader(vert, fragAtmospheric))
  }

  applyParameters(): void {
    super.applyParameters()
    this.screenShader.setUniformFloat('uBlurLevel', this.effectParams.blurLevel)
  }
}

export class SmoothEffect extends MazeScreenEffect {
  constructor() {
    super(new ScreenShader(vert, fragSmooth))
  }

  applyParameters(): void {
    super.applyParameters()
    this.screenShader.setUniformFloat('uBlurLevel', this.effectParams.blurLevel)
  }
}

export class AmbientEffect extends MazeScreenEffect {
  constructor() {
    super(new ScreenShader(vert, fragAmbient))
  }

  applyParameters(): void {
    super.applyParameters()
    this.screenShader.setUniformFloat('uBlurLevel', this.effectParams.blurLevel)
    this.screenShader.setUniformFloat('uRandomizationLevel', this.effectParams.pixelRandomizationLevel)
  }
}

export class DigitalEffect extends MazeScreenEffect {
  constructor() {
    super(new ScreenShader(vert, fragDigital))
  }

  applyParameters(): void {
    super.applyParameters()
    this.screenShader.setUniformFloat('uBlurLevel', this.effectParams.blurLevel)
    this.screenShader.setUniformFloat('uRandomizationLevel', this.effectParams.pixelRandomizationLevel)
    this.screenShader.setUniformFloat('uEdgeRenderingLevel', this.effectParams.edgeRenderingIntensityLevel)
  }
}

export class AbstractEffect extends MazeScreenEffect {
  constructor() {
    super(new ScreenShader(vert, fragEdge))
  }

  applyParameters(): void {
    super.applyParameters()
    this.screenShader.setUniformFloat('uEdgeRenderingLevel', this.effectParams.edgeRenderingIntensityLevel)
  }
}
