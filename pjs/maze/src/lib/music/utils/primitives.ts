import { Range } from "./types"
import Logger from "js-logger"

export class NumRange implements Range {
  private _min!: number
  public get min(): number {
    return this._min
  }
  public set min(value: number) {
    this._min = value
  }
  private _max!: number
  public get max(): number {
    return this._max
  }
  public set max(value: number) {
    this._max = value
  }
  constructor(r : Range) {
    if (r instanceof NumRange) {
      return r
    }
    if (r.max <= r.min) {
      throw new Error(`NumRange.max must be greater than min`)
    }
    this._min = r.min
    this._max = r.max
  }
  static clamp(
    val: Range,
    limit: Range,
    err = `provided value is out of limit range. it fell back to limit.`
  ) {
    let min = val.min
    let max = val.max
    if (val.min < limit.min) {
      Logger.warn(err, `invalid: ${val.min}`)
      min = limit.min
    }
    if (val.max > limit.max) {
      Logger.warn(err, `invalid: ${val.max}`)
      min = limit.max
    }
    return new NumRange({min, max})
  }
  public includes(n: number) {
    return this.min <= n && this.max >= n
  }
  public within(range: Range):boolean {
    return !(this._min < range.min || this._max > range.max)
  }
  public eq(range: Range): boolean {
    return this._min == range.min && this.max == range.max
  }
}
