import { GridDirection, GridPosition, makeContextManager } from 'mgnr-tone'
import { useEffect, useState } from 'react'
import { fireByRate, randomItemFromArray } from 'utils'
import { Music } from '../pjs/demo'

const createCommandBuffer = (initialCommands: GridDirection[] = []) => {
  let commands: GridDirection[] = initialCommands
  return {
    get command(): GridDirection | null {
      return commands.shift() || null
    },
    push(value: GridDirection) {
      commands.push(value)
    },
    set(value: GridDirection) {
      commands = [value]
    },
  }
}

const commandBuffer = createCommandBuffer(
  [...Array(50)].map(() => randomItemFromArray(['down', 'up', 'right', 'left'] as GridDirection[]))
)

export const makeMusicGrid = (makeMusic: () => Music): React.FC => {
  const music = makeMusic()
  const context = makeContextManager({
    bpm: music.config.bpm,
    initialise: () => music.applyInitialScene(),
    interval: music.config.interval,
    onInterval: () => {
      const command = commandBuffer.command
      if (command) {
        music.checkNextShift(command)
      }
    },
  })
  const play = () => {
    context.startContext()
    context.startPlaying()
  }
  return () => {
    useEffect(play, [])
    return (
      <div style={style}>
        <Grid music={music} />
        <div style={{ margin: 16 }}>
          <button style={{ padding: 8, margin: 8 }} onClick={play}>
            ▶︎ PLAY
          </button>
        </div>
        {/* <Commands /> */}
      </div>
    )
  }
}

const commands: GridDirection[] = ['up', 'down', 'right', 'left']

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

const Grid = ({ music }: { music: Music }) => {
  const [position, setPosition] = useState<GridPosition | null>('center-middle')
  const [alignment, setAlignment] = useState<GridPosition | null>('center-middle')
  useEffect(() => {
    setInterval(() => {
      if (fireByRate(0.5)) {
        setPosition(music.currentPosition.grid)
        setAlignment(music.currentPosition.theme)
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
        width: 300,
        height: 300,
        gap: 18,
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
  alignment: GridPosition | null
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
const positions: GridPosition[] = [
  'left-top','center-top','right-top',
  'left-middle','center-middle','right-middle',
  'left-bottom','center-bottom','right-bottom',
]

const style: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: 'white',
  fontSize: 24,
  backgroundColor: 'black',
  zIndex: 20,
  position: 'fixed',
  top: 0,
  left: 0,
}
