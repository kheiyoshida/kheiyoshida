// NameTrackSuffix
import { ParamsManager } from './manager'

export enum ControlMapping {
  Fader1 = 5,
  Fader2 = 6,
  Fader3 = 7,
  Fader4 = 8,
  Fader5 = 9,
  Fader6 = 10,
  Fader7 = 11,
  Fader8 = 12,

  // knobs
  Knob1A,
  Knob2A,
  Knob3A,
  Knob4A,
  Knob5A,
  Knob6A,
  Knob7A,
  Knob8A,

  Knob1B,
  Knob2B,
  Knob3B,
  Knob4B,
  Knob5B,
  Knob6B,
  Knob7B,
  Knob8B,

  Knob1C,
  Knob2C,
  Knob3C,
  Knob4C,
  Knob5C,
  Knob6C,
  Knob7C,
  Knob8C,

  // switches
  Switch1A,
  Switch2A,
  Switch3A,
  Switch4A,
  Switch5A,
  Switch6A,
  Switch7A,
  Switch8A,

  Switch1B,
  Switch2B,
  Switch3B,
  Switch4B,
  Switch5B,
  Switch6B,
  Switch7B,
  Switch8B,
}

export class LaunchControl {
  constructor(private params: ParamsManager) {}

  handle(midiMessage: Uint8Array): void {
    const control: ControlMapping = midiMessage[1]
    const value = midiMessage[2]

    const ctl = control - 5

    // cc 5 ~ 12
    if (ctl >= 0 && ctl <= 7) {
      if (control === ControlMapping.Fader1) return this.params.fader.faderValue1.update(value)
      if (control === ControlMapping.Fader2) return this.params.fader.faderValue2.update(value)
      if (control === ControlMapping.Fader3) return this.params.fader.faderValue3.update(value)
      if (control === ControlMapping.Fader4) return this.params.fader.faderValue4.update(value)
      if (control === ControlMapping.Fader5) return this.params.fader.faderValue5.update(value)
      if (control === ControlMapping.Fader6) return this.params.fader.faderValue6.update(value)
      if (control === ControlMapping.Fader7) return this.params.fader.faderValue7.update(value)
      if (control === ControlMapping.Fader8) return this.params.fader.faderValue8.update(value)
    }

    if (ctl >= 8) {
      const col = ctl % 8
      const row = Math.floor(ctl / 8)

      const target = this.params.params[col]

      if (row === 1) return target.knobValueA.update(value)
      if (row === 2) return target.knobValueB.update(value)
      if (row === 3) return target.knobValueC.update(value)
      if (row === 4) return target.switchValueA.update(value === 127)
      if (row === 5) return target.switchValueB.update(value === 127)
    }
  }
}
