import { useEffect, useState } from 'react'
import { WebMidi } from 'webmidi'
import { composite, polysynth, polysynth2, toneStart } from './synths'
import { MonoSynth, PolySynth } from 'tone'

toneStart()

const keyboardName = 'Q Mini'

const enable = () => {
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
}

export default () => {
  useEffect(() => {
    enable()
    toneStart()
  }, [])
  return (
    <div style={synthLabStyle}>
      <div id="note"></div>
      <Synth synth={polysynth} />
      <Synth synth={polysynth2} />
    </div>
  )
}

const Synth: React.FC<{ synth: PolySynth | MonoSynth }> = ({ synth }) => (
  <div style={{ margin: 8, border: '1px dotted black' }}>
    <Select onChange={(v) => synth.set({ oscillator: { type: v as any } })} />
    <Range label="A" onChange={(v) => synth.set({ envelope: { attack: v } })} />
    <Range label="D" onChange={(v) => synth.set({ envelope: { decay: v } })} />
    <Range label="S" onChange={(v) => synth.set({ envelope: { sustain: v } })} />
    <Range label="R" onChange={(v) => synth.set({ envelope: { release: v } })} />
  </div>
)

const Select: React.FC<{ onChange: (v: string) => void }> = ({ onChange }) => {
  const [v, setV] = useState('sine')
  return (
    <div>
      <select
        onChange={(e) => {
          setV(v)
          onChange(e.target.value)
        }}
      >
        {['sine', 'triangle', 'square', 'sawtooth', 'pulse'].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

const Range: React.FC<{ label: string; onChange: (v: number) => void }> = ({ label, onChange }) => {
  const [value, setValue] = useState(0.5)
  return (
    <div>
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value)
          onChange(v)
          setValue(v)
        }}
      />
      <span>{value}</span>
    </div>
  )
}

const synthLabStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  backgroundColor: 'white',
  // color: 'white',
}
