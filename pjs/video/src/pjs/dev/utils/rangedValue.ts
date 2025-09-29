import { clamp } from 'utils'

export class RangedValue {
  constructor(
    public anchor: number,
    public offsetRange: number,
    private minValue = 0,
    private maxValue = 1
  ) {}

  /**
   * @param deterministicValue normalised value between 0.0 - 1.0
   */
  public getConcreteValue(deterministicValue: number): number {
    const concreteValue = this.anchor + (deterministicValue - 0.5) * 2 * this.offsetRange
    return clamp(concreteValue, this.minValue, this.maxValue)
  }
}
