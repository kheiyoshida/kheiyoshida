import { Generator } from '../generator/Generator'
import { Destination } from './Destination'
import { MusicGenerator } from './MusicGenerator'
import { Output } from './Output'
import { SeqEvent } from './SequenceEvent'
import { SequenceOut } from './SequenceOut'

class MockOutput extends Output<unknown> {
  public set(outId: string, generator: Generator, inst: unknown, events?: SeqEvent): void {
    this.outs[outId] = new MockSequenceOut(generator, inst, outId, events)
  }
}

class MockSequenceOut extends SequenceOut {
  public assignSequence(loop?: number, startTime?: number): void {
    return undefined
  }
}

class MockDestination extends Destination {
  output = new MockOutput()
}

describe(`${MusicGenerator.name}`, () => {
  test(`${MusicGenerator.prototype.checkDestination.name}`, () => {
    const mgnr = new MusicGenerator(new MockDestination())
    mgnr.checkDestination('hey are you listening')
  })
})
