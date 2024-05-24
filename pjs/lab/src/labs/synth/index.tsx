import { useEffect } from 'react'
import { WebMidi } from 'webmidi'
import { composite, toneStart } from './synths'

toneStart()

const keyboardName = 'Q Mini'

WebMidi.enable()
  .then(() => {
    const keyboard = WebMidi.getInputByName(keyboardName)
    if (!keyboard) throw new Error('No keyboard found')

    keyboard.channels[1].addListener('noteon', (e) => {
      const el = document.getElementById('note')!
      const note = `${e.note.name}${e.note.accidental || ''}${e.note.octave}`
      el.innerText = note
      composite.triggerAttackRelease(note, '2n')
    })
  })
  .catch((err) => console.error(err))

export default () => {
  useEffect(() => {
    toneStart()
  }, [])
  return (
    <div style={synthLabStyle}>
      <div id="note"></div>
    </div>
  )
}

const synthLabStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(100, 100, 100)',
}
