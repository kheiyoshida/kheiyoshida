import { IFaderParamsControlAdapter, IKnobParamsControlAdapter } from './adapter'

export class ValueBuffer<T extends number | boolean> {
  constructor(value: T, private id = '') {
    this._value = value
  }

  private dirty = true
  private _value: T
  get value(): T {
    return this._value
  }

  public update(value: T): void {
    console.log(this.id, value)
    if (value !== this._value) {
      this._value = value
      this.dirty = true
    }
  }

  public apply(cb: (value: T) => void): void {
    if (!this.dirty) return
    cb(this.value)
    this.dirty = false
  }
}

export class KnobParamsBuffer {
  constructor(private target: IKnobParamsControlAdapter, private id: string = '') {}

  public readonly knobValueA = new ValueBuffer<number>(0, `${this.id} KnobA`);
  public readonly knobValueB = new ValueBuffer<number>(0, `${this.id} KnobB`);
  public readonly knobValueC = new ValueBuffer<number>(0, `${this.id} KnobC`);
  public readonly switchValueA = new ValueBuffer<boolean>(true, `${this.id} SwA`);
  public readonly switchValueB = new ValueBuffer<boolean>(true, `${this.id} SwB`);

  apply() {
    this.knobValueA.apply((v) => this.target.applyKnobValueA(v))
    this.knobValueB.apply((v) => this.target.applyKnobValueB(v))
    this.knobValueC.apply((v) => this.target.applyKnobValueC(v))
    this.switchValueA.apply((v) => this.target.applySwitchValueA(v))
    this.switchValueB.apply((v) => this.target.applySwitchValueB(v))
  }
}

export class FaderParamsBuffer {
  constructor(private target: IFaderParamsControlAdapter) {
  }

  public readonly faderValue1 = new ValueBuffer<number>(1, `fader 1`);
  public readonly faderValue2 = new ValueBuffer<number>(1, `fader 2`);
  public readonly faderValue3 = new ValueBuffer<number>(1, `fader 3`);
  public readonly faderValue4 = new ValueBuffer<number>(1, `fader 4`);
  public readonly faderValue5 = new ValueBuffer<number>(1, `fader 5`);
  public readonly faderValue6 = new ValueBuffer<number>(1, `fader 6`);
  public readonly faderValue7 = new ValueBuffer<number>(1, `fader 7`);
  public readonly faderValue8 = new ValueBuffer<number>(1, `fader 8`);

  apply() {
    this.faderValue1.apply(v => this.target.applyFaderValue1(v))
    this.faderValue2.apply(v => this.target.applyFaderValue2(v))
    this.faderValue3.apply(v => this.target.applyFaderValue3(v))
    this.faderValue4.apply(v => this.target.applyFaderValue4(v))
    this.faderValue5.apply(v => this.target.applyFaderValue5(v))
    this.faderValue6.apply(v => this.target.applyFaderValue6(v))
    this.faderValue7.apply(v => this.target.applyFaderValue7(v))
    this.faderValue8.apply(v => this.target.applyFaderValue8(v))
  }
}
