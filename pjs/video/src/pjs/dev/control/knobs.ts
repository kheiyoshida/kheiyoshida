import { IKnobParamsControlAdapter } from '../../../lib/params/adapter'
import { LinePresentation } from '../presentation/line'

export class LinePresentationControl implements IKnobParamsControlAdapter {
  constructor(private presentation: LinePresentation) {}

  applyKnobValueA(value: number): void {
    this.presentation.setMaxDistance(2 + (value / 127) * 10)
  }

  applyKnobValueB(value: number): void {
    this.presentation.setLuminanceThreshold((value / 127) / 5) // up to 0.2
  }
  applyKnobValueC(value: number): void {}
  applySwitchValueA(value: boolean): void {
    this.presentation.enabled = value
  }
  applySwitchValueB(value: boolean): void {}
}
