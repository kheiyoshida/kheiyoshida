/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */
import { IKnobParamsControlAdapter } from '../../../lib/params/adapter'
import { LinePresentation } from '../presentation/line'
import { PixelPresentation } from '../../../lib/presentation'
import { DotPresentation } from '../presentation/dot'
import { GlyphPresentation } from '../presentation/glyph'
import { MultiplyEffectModel } from '../effect/multiply'
import { ObjectRenderingChannel } from '../../../lib/channel/object'
import { CubeRenderingChannel } from '../channels/object'

abstract class PresentationControl<P extends PixelPresentation> implements IKnobParamsControlAdapter {
  public constructor(protected presentation: P) {}

  abstract applyKnobValueA(value: number): void
  abstract applyKnobValueB(value: number): void
  applyKnobValueC(value: number): void {}

  applySwitchValueA(value: boolean): void {
    this.presentation.enabled = value
  }
  applySwitchValueB(value: boolean): void {}
}

export class LinePresentationControl extends PresentationControl<LinePresentation> {
  applyKnobValueA(value: number): void {
    this.presentation.setMaxDistance(2 + (value / 127) * 10)
  }
  applyKnobValueB(value: number): void {
    this.presentation.setLuminanceThreshold(value / 127 / 5) // up to 0.2
  }
}

export class DotPresentationControl extends PresentationControl<DotPresentation> {
  applyKnobValueA(value: number): void {
    this.presentation.dotSize = value / 127
  }
  applyKnobValueB(value: number): void {
    this.presentation.densityX = value / 127
  }
  applyKnobValueC(value: number) {
    this.presentation.densityY = value / 127
  }
}

export class GlyphPresentationControl extends PresentationControl<GlyphPresentation> {
  applyKnobValueA(value: number): void {
    this.presentation.dotSize = value / 127
  }
  applyKnobValueB(value: number): void {
    this.presentation.densityX = value / 127
  }
  applyKnobValueC(value: number): void {
    this.presentation.densityY = value / 127
  }
}

export class ChannelControl implements IKnobParamsControlAdapter {
  constructor(private cubeCh: CubeRenderingChannel) {}
  applyKnobValueA(value: number): void {
    this.cubeCh.cube.scale = 2 * (value / 127)
  }
  applyKnobValueB(value: number): void {}
  applyKnobValueC(value: number): void {}
  applySwitchValueA(value: boolean): void {}
  applySwitchValueB(value: boolean): void {}
}

export class PostEffectControl implements IKnobParamsControlAdapter {
  constructor(private multiplyFx: MultiplyEffectModel) {}
  applyKnobValueA(value: number): void {
    const numOfMultiply = Math.ceil(this.multiplyFx.maxMultiply * (value / 127))
    this.multiplyFx.setMultiply(numOfMultiply)
  }
  applyKnobValueB(value: number): void {}
  applyKnobValueC(value: number): void {}
  applySwitchValueA(value: boolean): void {
    this.multiplyFx.enabled = value
  }
  applySwitchValueB(value: boolean): void {}
}
