import React, { useEffect, useState } from 'react'
import { IsMobile, logicalCenterY } from '../../config'
import { getUIRenderer } from './renderer'

let titleLoop: NodeJS.Timeout

const fontSize = IsMobile ? 36 : 20
const drawTitle = (version: string) => {
  if (titleLoop) return

  const renderer = getUIRenderer()

  titleLoop = setInterval(() => {
    renderer.clearCanvas()

    renderer.drawText({
      positionX: fontSize + 1,
      positionY: logicalCenterY + 1,
      fontSize,
      text: 'MAZE ' + version,
      temporaryFillColor: [0, 0, 0.3],
    })
    renderer.drawText({
      positionX: fontSize,
      positionY: logicalCenterY,
      fontSize,
      text: 'MAZE',
      temporaryFillColor: [0, 0, 1],
    })

    // renderer.drawText({
    //   positionX: fontSize,
    //   positionY: logicalCenterY + fontSize,
    //   fontSize: Math.max(10, fontSize / 2),
    //   text: 'CLICK/TAP TO PLAY',
    //   temporaryFillColor: [0, 0, 0.5],
    // })
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
    >
      <div style={styles.version}>version: {version}</div>
    </div>
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
  version: {
    position: 'fixed',
    top: 0,
    left: 0,
    color: 'white',
    backgroundColor: 'grey',
  },
}
