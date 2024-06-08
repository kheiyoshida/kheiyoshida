import { ThemeGridDirection, ThemeGridPosition } from 'mgnr-tone'
import { useEffect, useState } from 'react'
import * as Tone from 'tone'
import { fireByRate, randomItemFromArray } from 'utils'
import { createCommandBuffer, createMusic } from './music'
import { themeGrid } from './themes'

const commandBuffer = createCommandBuffer(
  [...Array(50)].map(() =>
    randomItemFromArray(['down', 'up', 'right', 'left'] as ThemeGridDirection[])
  )
)

const music = createMusic(themeGrid)

let started = false

const play = () => {
  if (Tone.context.state === 'suspended') {
    Tone.start()
  }
  if (started) return
  Tone.Transport.bpm.value = 162
  Tone.Transport.start()
  music.applyInitialTheme()
  Tone.Transport.scheduleRepeat(
    () => {
      music.checkNextTheme(commandBuffer.command)
    },
    '16m',
    0
  )
  started = true
}

export default () => {
  useEffect(play, [])
  return (
    <div style={style}>
      <Grid />
      <div style={{ margin: 16 }}>
        <button style={{ padding: 8, margin: 8 }} onClick={play}>
          click to start
        </button>
      </div>
      <Commands />
    </div>
  )
}

const commands: ThemeGridDirection[] = ['up', 'down', 'right', 'left']

const Commands = () => {
  return (
    <div style={{ margin: 16 }}>
      {commands.map((c) => (
        <button key={c} onClick={() => commandBuffer.set(c)}>
          {c}
        </button>
      ))}
    </div>
  )
}

const Grid = () => {
  const [position, setPosition] = useState<ThemeGridPosition | null>('center-middle')
  const [alignment, setAlignment] = useState<ThemeGridPosition | null>('center-middle')
  useEffect(() => {
    setInterval(() => {
      if (fireByRate(0.5)) {
        setPosition(themeGrid.current.grid)
        setAlignment(themeGrid.current.theme)
      } else {
        setPosition(null)
        setAlignment(null)
      }
    }, 60000 / 162)
  }, [])

  return (
    <div
      style={{
        display: 'grid',
        width: 500,
        height: 500,
        gap: 20,
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
    >
      {positions.map((p) => (
        <MiniGrid key={p} alignment={alignment} matchPosition={p === position} />
      ))}
    </div>
  )
}

const MiniGrid = ({
  alignment,
  matchPosition,
}: {
  alignment: ThemeGridPosition | null
  matchPosition: boolean
}) => {
  return (
    <div
      style={{
        display: 'grid',
        width: '100%',
        height: '100%',
        gap: 20,
        gridTemplateColumns: '1fr 1fr 1fr',
      }}
    >
      {positions.map((p) => (
        <div
          key={p}
          style={{
            backgroundColor:
              matchPosition && alignment === p
                ? 'rgb(180, 10, 50)'
                : fireByRate(0.3)
                  ? 'white'
                  : 'gray',
          }}
        ></div>
      ))}
    </div>
  )
}

// prettier-ignore
const positions: ThemeGridPosition[] = [
  'left-top','center-top','right-top',
  'left-middle','center-middle','right-middle',
  'left-bottom','center-bottom','right-bottom',
]

const style: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: 'white',
  fontSize: 24,
  backgroundColor: 'black',
}
