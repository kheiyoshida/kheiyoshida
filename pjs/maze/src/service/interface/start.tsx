import React, { useEffect, useState } from 'react'
import { IsMobile, logicalHeight } from '../../config'
import { getUIRenderer } from './renderer'

let titleLoop: NodeJS.Timeout

const fontSize = IsMobile ? 36 : 20
const drawTitle = (version: string) => {
  if (titleLoop) return

  const renderer = getUIRenderer()

  titleLoop = setInterval(() => {
    renderer.clearCanvas()

    const head = fontSize * 4

    renderer.drawText({
      positionX: fontSize * 2 + 1,
      positionY: head,
      fontSize,
      text: 'MAZE',
      temporaryFillColor: [0, 0, 0.3],
    })

    renderer.drawText({
      positionX: fontSize * 2,
      positionY: head,
      fontSize,
      text: 'MAZE',
      temporaryFillColor: [0, 0, 1],
    })

    renderer.drawText({
      positionX: fontSize * 2,
      positionY: head + fontSize * 2,
      fontSize: fontSize / 2,
      text: 'Click/Tap to start.',
      temporaryFillColor: [0, 0, 0.88],
    })

    renderer.drawText({
      positionX: fontSize * 2,
      positionY: head + fontSize *4,
      fontSize: fontSize / 2,
      text: 'Turn on sound before playing.',
      temporaryFillColor: [0, 0, 0.88],
    })

    const smallFont = fontSize / 2
    renderer.drawText({
      positionX: fontSize * 2,
      positionY: logicalHeight - smallFont * 1.5,
      fontSize: smallFont,
      text: version,
      temporaryFillColor: [0, 0, 0.8],
    })
  }, 100)
}

const clearTitle = () => {
  getUIRenderer().clearCanvas()
  clearInterval(titleLoop)
}

export const Start = ({ version, start }: { version: string; start: () => void }) => {
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (started) return
    drawTitle(version)
  }, [])
  return !started ? (
    <div
      style={styles.container}
      onClick={() => {
        clearTitle()
        setStarted(true)
        start()
      }}
    />
  ) : null
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
  },
}
