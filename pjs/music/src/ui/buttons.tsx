import { GridDirection } from 'mgnr-tone'
import { useEffect, useRef, useState } from 'react'
import { randomItemFromArray } from 'utils'

const createCommandBuffer = (initialCommands: GridDirection[] = []) => {
  let commands: GridDirection[] = initialCommands
  return {
    get currentCommands() {
      return commands
    },
    get command(): GridDirection | null {
      return commands.shift() || randomItemFromArray(['down', 'up', 'left', 'right'])
    },
    push(value: GridDirection) {
      commands.push(value)
    },
    set(value: GridDirection) {
      commands = [value]
    },
    flush() {
      commands = []
    },
  }
}

export const commandBuffer = createCommandBuffer()

export const Expressions = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setInterval(() => {
      const expressions = commandBuffer.currentCommands
        .map((c) => commandExpressionMap[c])
        .join(` `)
      if (ref.current) {
        ref.current.textContent = expressions
      }
    }, 1000)
  }, [])

  return <div ref={ref} style={{ minHeight: 48, margin: 16 }} />
}

export const commands: GridDirection[] = ['up', 'down', 'right', 'left']

export const commandExpressionMap: Record<GridDirection, string> = {
  up: '↑',
  down: '↓',
  right: '→',
  left: '←',
}

export const Commands: React.FC<{ play: () => void }> = ({ play }) => {
  const Button = makeButton(play)
  return (
    <div style={{ display: 'grid', width: 200, gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <Button row={2} col={2} onClick={() => commandBuffer.flush()} text="x" />
      <Button row={1} col={2} onClick={() => commandBuffer.push('up')} text="↑" />
      <Button row={2} col={1} onClick={() => commandBuffer.push('left')} text="←" />
      <Button row={2} col={3} onClick={() => commandBuffer.push('right')} text="→" />
      <Button row={3} col={2} onClick={() => commandBuffer.push('down')} text="↓" />
    </div>
  )
}

const makeButton =
  (play: () => void) =>
  ({
    onClick,
    row,
    col,
    text,
  }: {
    onClick: () => void
    row: number
    col: number
    text: string
  }) => {
    const [hover, setHover] = useState(false)
    const buttonStyle: React.CSSProperties = {
      padding: 8,
      color: hover ? 'black' : 'white',
      border: '1px solid white',
      backgroundColor: hover ? 'white' : 'black',
      fontSize: 16,
      fontStyle: 'bold',
      borderRadius: 8,
    }

    return (
      <button
        style={{ ...buttonStyle, gridColumn: col, gridRow: row }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          play()
          onClick()
        }}
      >
        {text}
      </button>
    )
  }
