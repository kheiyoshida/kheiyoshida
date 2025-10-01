/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */
import { IKnobParamsControlAdapter } from '../../../lib/params/adapter'
import { LinePresentation } from '../presentation/line'
import { PixelPresentation } from '../../../lib/presentation'
import { DotPresentation } from '../presentation/dot'
import { GlyphPresentation } from '../presentation/glyph'
import { MultiplyEffectModel } from '../effect/multiply'
import { CubeRenderingChannel } from '../channels/object'
import { ColorEffect } from '../effect/saturation'
import { SoundLevel } from './soundLevel'
import { CameraChannel } from '../../../lib/channel/camera'

export class ChannelControl implements IKnobParamsControlAdapter {
  constructor(
    private cubeCh: CubeRenderingChannel,
    private soundLevel: SoundLevel
  ) {}
  applyKnobValueA(value: number): void {
    this.cubeCh.cube.scale.anchor = 2 * (value / 127)
    this.cubeCh.cube2.scale.anchor = 2 * (value / 127)
  }
  applyKnobValueB(value: number): void {
    this.soundLevel.maxLoudness = -3 - value / 127
  }
  applyKnobValueC(value: number): void {
    this.soundLevel.maxLoudness = -0.2 - value / 127
  }
  applySwitchValueA(value: boolean): void {}
  applySwitchValueB(value: boolean): void {
    this.cubeCh.cube.wireframe = value
    this.cubeCh.cube2.wireframe = value
  }
}

export class InputControl implements IKnobParamsControlAdapter {
  constructor(
    private cameraCh: CameraChannel,
    private glyphPresentation: GlyphPresentation
  ) {}
  applyKnobValueA(value: number): void {
    this.cameraCh.setContrast(2 + (value / 127) * 0.5)
  }
  applyKnobValueB(value: number): void {
    this.cameraCh.setBrightness(0.4 + (value / 127) * 0.4)
  }
  applyKnobValueC(value: number): void {
    this.glyphPresentation.currentGlyph = Math.floor((value/127) * 3)
  }
  applySwitchValueA(value: boolean): void {}
  applySwitchValueB(value: boolean): void {}
}

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
    this.presentation.maxDistance.anchor = 1 + (value / 127) * 20
  }
  applyKnobValueB(value: number): void {
    this.presentation.maxDistance.offsetRange = Math.floor((value / 127) * 8)
  }
  applyKnobValueC(value: number) {
    this.presentation.setLuminanceThresholdDirect(Math.max(0.1, (value / 127) * 0.5))
  }
  applySwitchValueB(value: boolean) {
    this.presentation.setVertical(value)
  }
}

export class DotPresentationControl extends PresentationControl<DotPresentation> {
  applyKnobValueA(value: number): void {
    this.presentation.dotSize.anchor = value / 127
  }
  applyKnobValueB(value: number): void {
    this.presentation.densityX.offsetRange = value / 127
  }
  applyKnobValueC(value: number) {
    this.presentation.densityY.offsetRange = value / 127
  }
}

export class GlyphPresentationControl extends PresentationControl<GlyphPresentation> {
  applyKnobValueA(value: number): void {
    this.presentation.dotSize.anchor = value / 127
  }
  applyKnobValueB(value: number): void {
    this.presentation.densityX = value / 127
  }
  applyKnobValueC(value: number): void {
    this.presentation.densityY = value / 127
  }
}

export class PostEffectControl implements IKnobParamsControlAdapter {
  constructor(private multiplyFx: MultiplyEffectModel) {}
  applyKnobValueA(value: number): void {
    this.multiplyFx.sensitivity = value / 127
  }
  applyKnobValueB(value: number): void {
    this.multiplyFx.multiply.anchor = 1 // Math.max(1, Math.ceil(this.multiplyFx.maxMultiply * (value / 127)))
  }
  applyKnobValueC(value: number): void {
    this.multiplyFx.multiply.offsetRange = 12 // this.multiplyFx.maxMultiply * (value / 127)
  }
  applySwitchValueA(value: boolean): void {
    this.multiplyFx.enabled = value
  }
  applySwitchValueB(value: boolean): void {}
}

export class ColorSaturationControl implements IKnobParamsControlAdapter {
  constructor(private colorEffect: ColorEffect) {}

  applyKnobValueA(value: number): void {
    this.colorEffect.saturation = [
      2 * (value / 127),
      this.colorEffect.saturation[1],
      this.colorEffect.saturation[2],
    ]
  }
  applyKnobValueB(value: number): void {
    this.colorEffect.saturation = [
      this.colorEffect.saturation[0],
      2 * (value / 127),
      this.colorEffect.saturation[2],
    ]
  }
  applyKnobValueC(value: number): void {
    this.colorEffect.saturation = [
      this.colorEffect.saturation[0],
      this.colorEffect.saturation[1],
      2 * (value / 127),
    ]
  }
  applySwitchValueA(value: boolean): void {
    this.colorEffect.enableSaturation(value)
  }
  applySwitchValueB(value: boolean): void {
    this.colorEffect.useMonotone(value)
  }
}

export class ColorCapControl implements IKnobParamsControlAdapter {
  constructor(private colorEffect: ColorEffect) {}

  applyKnobValueA(value: number): void {
    this.colorEffect.luminanceCap = Math.min((0.8 * value) / 127)
  }
  applyKnobValueB(value: number): void {
    this.colorEffect.luminanceBase = Math.max(0.01, (0.1 * value) / 127)
  }
  applyKnobValueC(value: number): void {
    this.colorEffect.saturationOffsetLevel.offsetRange = (0.2 * value) / 127
  }
  applySwitchValueA(value: boolean): void {}
  applySwitchValueB(value: boolean): void {}
}
