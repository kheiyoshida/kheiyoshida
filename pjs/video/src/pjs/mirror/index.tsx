'use client'
import React, { useEffect, useState } from 'react'
import { app } from './app'

export default () => {
  const [initialised, setInitialised] = useState(false)
  useEffect(() => {
    if (initialised) return
    setInitialised(true)
    void app()
  }, [initialised])
  return (
    <div style={styles.canvasContainer}>
      <canvas id={'canvas'} style={styles.canvas} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  canvasContainer: {
    // zIndex: 10,
    // position: 'fixed',
    // top: 0,
    // left: 0,
    // width: '100vw',
    // height: '100dvh',
    // overflow: 'hidden',
    // backgroundColor: 'black',
    // margin: '0 auto',
    // touchAction: 'manipulation',
    // overflowX: 'hidden',
    // overflowY: 'hidden',
    // overscrollBehavior: 'none',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  canvas: {
    width: '100vw',
    height: '100vh',
    display: 'block'
  },
}
