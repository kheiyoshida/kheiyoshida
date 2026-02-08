/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */
import { IKnobParamsControlAdapter } from '../../../lib/params/adapter'
import { LinePresentation } from '../presentation/line'

import { DotPresentation } from '../presentation/dot'
import { GlyphPresentation } from '../presentation/glyph'
import { MultiplyEffectModel } from '../effect/multiply'
import { CubeRenderingChannel } from '../channels/object'
import { ColorEffect } from '../effect/color'
import { SoundLevel } from './soundLevel'
import { CameraChannel } from '../../../lib-node/channel/camera/camera'
import { DebugPresentation } from '../presentation/debug'
import { PixelPresentation } from '../../../lib-node/presentation/presentation'

export class ChannelControl implements IKnobParamsControlAdapter {
  constructor(
    private cubeCh: CubeRenderingChannel,
    private soundLevel: SoundLevel,
    private debugPresentation: DebugPresentation
  ) {}

  initialValues: IKnobParamsControlAdapter['initialValues'] = [60, 0, 0, true, false]

  applyKnobValueA(value: number): void {
    this.cubeCh.cube.scale.anchor = 2 * (value / 127)
    this.cubeCh.cube2.scale.anchor = 2 * (value / 127)
  }
  applyKnobValueB(value: number): void {
    this.soundLevel.maxLoudness = -3 - 2 * (value / 127)
  }
  applyKnobValueC(value: number): void {
    this.soundLevel.minLoudness = -0.2 - value / 127
  }
  applySwitchValueA(value: boolean): void {
    this.debugPresentation.enabled = value
  }
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

  // TODO: adjust initial contrast and brightness
  initialValues: IKnobParamsControlAdapter['initialValues'] = [20, 20, 0, false, false]

  applyKnobValueA(value: number): void {
    this.cameraCh.setContrast(2 + (value / 127) * 0.5)
  }
  applyKnobValueB(value: number): void {
    this.cameraCh.setBrightness(0.4 + (value / 127) * 0.4)
  }
  applyKnobValueC(value: number): void {
    this.glyphPresentation.currentGlyph = Math.floor((value / 127) * 3)
  }
  applySwitchValueA(value: boolean): void {}
  applySwitchValueB(value: boolean): void {}
}

abstract class PresentationControl<P extends PixelPresentation> implements IKnobParamsControlAdapter {
  public constructor(protected presentation: P) {}

  abstract get initialValues(): IKnobParamsControlAdapter['initialValues']

  abstract applyKnobValueA(value: number): void
  abstract applyKnobValueB(value: number): void
  applyKnobValueC(value: number): void {}

  applySwitchValueA(value: boolean): void {
    this.presentation.enabled = value
  }
  applySwitchValueB(value: boolean): void {}
}

export class LinePresentationControl extends PresentationControl<LinePresentation> {
  initialValues: IKnobParamsControlAdapter['initialValues'] = [0, 30, 10, true, false]

  applyKnobValueA(value: number): void {
    this.presentation.maxDistance.anchor = 1 + (value / 127) * 80
  }
  applyKnobValueB(value: number): void {
    this.presentation.maxDistance.offsetRange = Math.floor((value / 127) * 80)
  }
  applyKnobValueC(value: number) {
    this.presentation.setLuminanceThresholdDirect(Math.max(0.1, (1 - value / 127) * 0.5))
  }
  applySwitchValueB(value: boolean) {
    this.presentation.setVertical(value)
  }
}

export class DotPresentationControl extends PresentationControl<DotPresentation> {
  initialValues: IKnobParamsControlAdapter['initialValues'] = [127, 70, 70, true, false]

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
  initialValues: IKnobParamsControlAdapter['initialValues'] = [60, 20, 0, true, false]
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
  initialValues: IKnobParamsControlAdapter['initialValues'] = [10, 10, 10, false, false]
  applyKnobValueA(value: number): void {
    this.multiplyFx.sensitivity = value / 127
  }
  applyKnobValueB(value: number): void {
    this.multiplyFx.multiply.anchor = Math.max(1, Math.ceil(this.multiplyFx.maxMultiply * (value / 127)))
  }
  applyKnobValueC(value: number): void {
    this.multiplyFx.multiply.offsetRange = this.multiplyFx.maxMultiply * (value / 127)
  }
  applySwitchValueA(value: boolean): void {
    this.multiplyFx.enabled = value
  }
  applySwitchValueB(value: boolean): void {}
}

export class ColorSaturationControl implements IKnobParamsControlAdapter {
  constructor(private colorEffect: ColorEffect) {}
  initialValues: IKnobParamsControlAdapter['initialValues'] = [60, 60, 60, false, false]

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
  initialValues: IKnobParamsControlAdapter['initialValues'] = [100, 0, 60, false, false]

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
