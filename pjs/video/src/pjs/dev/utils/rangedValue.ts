import { clamp } from 'utils'

export class RangedValue {
  constructor(
    public anchor: number,
    public offsetRange: number,
    private minValue = 0,
    private maxValue = 1
  ) {}

  public updateValue(deterministicValue: number): number {
    const concreteValue = this.anchor + (deterministicValue - 0.5) * 2 * this.offsetRange
    this._value = clamp(concreteValue, this.minValue, this.maxValue)
    return this._value
  }

  private _value: number = 0;
  public get value() {
    return this._value
  }
}
