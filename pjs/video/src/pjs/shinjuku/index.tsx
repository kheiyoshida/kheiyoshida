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
      <div id={'message'} style={styles.message}></div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  canvasContainer: {
    zIndex: 10,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: 'black',
    margin: '0 auto',
    touchAction: 'manipulation',
    overflowX: 'hidden',
    overflowY: 'hidden',
    overscrollBehavior: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    display: 'block',
    width: '100vw',
    height: 'auto',
    aspectRatio: 16 / 9,
    border: '1px solid black',
  },
  message: {
    position: 'fixed',
    top: window.innerHeight / 2,
    left: window.innerWidth / 2 - 100,
    width: 200,
    height: 300,
    textAlign: 'center',
    zIndex: 100,
    cursor: 'pointer',
  },
}
