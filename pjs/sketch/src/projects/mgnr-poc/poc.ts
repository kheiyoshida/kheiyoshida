import { ToneOutput } from 'mgnr/src/externals/tone/Output'
import { ToneSequenceOut } from 'mgnr/src/externals/tone/SequenceOut'
import {
  createGenerator,
  createInstChannel,
  createInstrument,
  createMixer,
} from 'mgnr/src/poc/index'
import * as Tone from 'tone'

let musician: {
  out: ToneSequenceOut2
  resolve: (handler: (out: ToneSequenceOut2) => void) => void
}

class ToneSequenceOut2 extends ToneSequenceOut {

  // initialized somewhere
  private definedEvents = {
    endedHandler(out: ToneSequenceOut2) {
      out.assignSequence(4)
      console.log('reassigned')
    }
  }

  protected checkEvent(loop: number, repeatNth: number) {
    if (this.events.elapsed) {
      // 
    }
    if (repeatNth === loop) {
      console.log('loop ended')
      
      // resolve defined events. 
      // this class doesn't know about the central things,
      // so need to resolve by using global musician object
      musician.resolve(this.definedEvents.endedHandler)
    }
  }
}

export const mgnrPoc = () => {
  // client can create generator
  const generator = createGenerator()

  // client can assign generator to channel output
  const inst = createInstrument()
  const channel = createInstChannel(inst)

  const out = new ToneSequenceOut2(generator, inst, 'chId', {

  })
  out.assignSequence(4)

  // set central manager somewhere
  musician = {
    out,
    resolve(handler) {
      handler(this.out)
    },
  }

  // cleint can assign channel to mixer (master output)
  const mixer = createMixer()
  mixer.addInstChannel('channelId', channel)

  // client can start music and hear the generated sequences
  Tone.Transport.start()
  Tone.start()
}
