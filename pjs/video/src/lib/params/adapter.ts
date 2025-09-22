export interface IKnobParamsControlAdapter {
  applyKnobValueA(value: number): void
  applyKnobValueB(value: number): void
  applyKnobValueC(value: number): void
  applySwitchValueA(value: boolean): void
  applySwitchValueB(value: boolean): void
}

export interface IFaderParamsControlAdapter {
  applyFaderValue1(value: number): void
  applyFaderValue2(value: number): void
  applyFaderValue3(value: number): void
  applyFaderValue4(value: number): void
  applyFaderValue5(value: number): void
  applyFaderValue6(value: number): void
  applyFaderValue7(value: number): void
  applyFaderValue8(value: number): void
}

export const NoOpKnobParamsAdapter: IKnobParamsControlAdapter = {
  applyKnobValueA(value: number): void {},
  applyKnobValueB(value: number): void {},
  applyKnobValueC(value: number): void {},
  applySwitchValueA(value: boolean): void {},
  applySwitchValueB(value: boolean): void {},
}

export const NoOpFaderParamsAdapter: IFaderParamsControlAdapter = {
  applyFaderValue1: function (value: number): void {},
  applyFaderValue2: function (value: number): void {},
  applyFaderValue3: function (value: number): void {},
  applyFaderValue4: function (value: number): void {},
  applyFaderValue5: function (value: number): void {},
  applyFaderValue6: function (value: number): void {},
  applyFaderValue7: function (value: number): void {},
  applyFaderValue8: function (value: number): void {},
}
