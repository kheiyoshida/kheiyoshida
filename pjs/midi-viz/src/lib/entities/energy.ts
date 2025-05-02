/**
 * instance to track notes with certain channel/pitch
 */
export class Energy {
  constructor(
    private channel: number,
    private pitch: number,
  ) {
  }

  is(channel: number, pitch: number) {
    return this.channel == channel && this.pitch == pitch
  }

  public value = 0

  static ReduceAmount = 1
  static IncreaseAmount = 10

  reduce() {
    this.value = Math.max(0, this.value - Energy.ReduceAmount)
  }

  increase() {
    this.value = Math.min(10, this.value + Energy.IncreaseAmount)
  }
}

export type EnergyRepresentation = {
  update(energy: Energy): void
}
