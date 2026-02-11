'use client'
import React, { useEffect, useState } from 'react'
import { app, appState } from './app'

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
      <Control />
    </div>
  )
}

const Control: React.FC = () => {
  const [open, setOpen] = useState(false)
  const values = { ...appState }
  return (
    <div style={styles.modalContainer} onClick={() => setOpen(!open)}>
      {open ? (
        <div style={styles.modalBackground}>
          <div>
            <div>Feature Threshold: {values.featureThreshold}</div>
            <input
              type="range"
              min={0}
              max={0.3}
              step={0.01}
              defaultValue={values.featureThreshold}
              onChange={(v) => {
                appState.featureThreshold = Number(v.target.value)
              }}
            />
          </div>

          <div>
            <div>Search Radius: {values.searchRadius}</div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              defaultValue={values.searchRadius}
              onChange={(v) => {
                appState.searchRadius = Number(v.target.value)
              }}
            />
          </div>

          <div>
            <div>Diff Threshold: {values.diffThreshold}</div>
            <input
              type="range"
              min={0.001}
              max={0.3}
              step={0.001}
              defaultValue={values.diffThreshold}
              onChange={(v) => {
                appState.diffThreshold = Number(v.target.value)
              }}
            />
          </div>
        </div>
      ) : null}
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
    height: '100vh',
  },
  modalContainer: {
    zIndex: 20,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    padding: '16px',
    backgroundColor: 'white',
    opacity: 0.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    color: 'black',
  },
}
