/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */
import { IKnobParamsControlAdapter } from '../../../lib/params/adapter'
import { LinePresentation } from '../presentation/line'
import { PixelPresentation } from '../../../lib/presentation'
import { DotPresentation } from '../presentation/dot'
import { GlyphPresentation } from '../presentation/glyph'

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
    this.presentation.dotSize = (value / 127)
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
      this.presentation.dotSize = (value / 127)
    }
    applyKnobValueB(value: number): void {
      this.presentation.densityX = value / 127
    }
    applyKnobValueC(value: number): void {
      this.presentation.densityY = value / 127
    }
}
