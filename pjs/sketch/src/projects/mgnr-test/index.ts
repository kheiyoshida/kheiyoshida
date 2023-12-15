import * as Tone from 'tone'

import { test1, testWrap } from './mgnr-test'

const setup = () => {
  // startSound()
  testWrap(() => {
    test1()
    Tone.start()
    Tone.Transport.start()
    
  })
}

const draw = () => {}

export default <Sketch>{
  setup,
  draw,
}
