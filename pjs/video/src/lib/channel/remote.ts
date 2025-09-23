export class ChannelRemote {
  constructor(private numOfChannels: number) {
    this.switchRate = new Array(numOfChannels)
    for(let i = 0; i < numOfChannels; i++) {
      this.switchRate[i] = 1
    }
  }

  public readonly switchRate

  private channelIndex = 0;

  public set channelNumber(value: number) {
    if (value < 0) return;
    this.channelIndex = value % this.numOfChannels
  }

  public get channelNumber(): number {
    return this.channelIndex;
  }

  next(): number {
    this.channelNumber += 1;
    return this.channelNumber;
  }

  random(): number {
    const result = weightedRandomIndex(this.switchRate)
    console.log('picker', result)
    this.channelNumber = result
    console.log('random', this.channelNumber)
    return this.channelNumber
  }
}

function weightedRandomIndex(weights: number[]): number {
  console.log(weights)
  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let acc = 0;

  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r < acc) {
      return i;
    }
  }

  console.warn(`picked -1 for ${weights.join(", ")}`)

  // fallback (shouldn't happen unless weights are empty or all 0)
  return -1;
}
