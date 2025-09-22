export interface IKnobParamsAdapter {
  ApplyKnobValueA(value: number): void
  ApplyKnobValueB(value: number): void
  ApplyKnobValueC(value: number): void
  ApplySwitchValueA(value: boolean): void
  ApplySwitchValueB(value: boolean): void
}

export interface IFaderParamsAdapter {
  ApplyFaderValue1(value: number): void
  ApplyFaderValue2(value: number): void
  ApplyFaderValue3(value: number): void
  ApplyFaderValue4(value: number): void
  ApplyFaderValue5(value: number): void
  ApplyFaderValue6(value: number): void
  ApplyFaderValue7(value: number): void
  ApplyFaderValue8(value: number): void
}

export const NoOpKnobParamsAdapter: IKnobParamsAdapter = {
  ApplyKnobValueA(value: number): void {},
  ApplyKnobValueB(value: number): void {},
  ApplyKnobValueC(value: number): void {},
  ApplySwitchValueA(value: boolean): void {},
  ApplySwitchValueB(value: boolean): void {},
}

export const NoOpFaderParamsAdapter: IFaderParamsAdapter = {
  ApplyFaderValue1: function (value: number): void {},
  ApplyFaderValue2: function (value: number): void {},
  ApplyFaderValue3: function (value: number): void {},
  ApplyFaderValue4: function (value: number): void {},
  ApplyFaderValue5: function (value: number): void {},
  ApplyFaderValue6: function (value: number): void {},
  ApplyFaderValue7: function (value: number): void {},
  ApplyFaderValue8: function (value: number): void {},
}
