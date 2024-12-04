import React, { useState } from 'react'
import { MobileWidth } from '../../config';

export const Start = ({ version, start }: { version: string; start: () => void }) => {
  const [started, setStarted] = useState(false)
  return !started ? (
    <div
      style={styles.container}
      onClick={() => {
        start()
        setStarted(true)
      }}
    >
      <div style={styles.textbox}>
        <div style={styles.title}>MAZE</div>
        <div style={styles.version}>{version}</div>
        <Instruction />
      </div>
    </div>
  ) : null
}

const Instruction = () => window.innerWidth > MobileWidth ? (
  <div style={styles.instruction}>
    <div>Click to start (*plays sound*)</div>
    <div>Move with arrow keys</div>
    <div>Open map with 'M' or '↓'</div>
  </div>
) : (
  <div style={styles.instruction}>
    <div>Click to start (*plays sound*)</div>
    <div>Move with arrow buttons</div>
    <div>Open map with 'M'</div>
  </div>
)

const styles: Record<string, React.CSSProperties> = {
  container: {
    // width: '100%',
    // height: '100%',
    color: 'rgba(255, 255, 255)',
    backgroundColor: 'rgba(0, 0, 0)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textbox: {
    border: '1px solid rgba(255, 255, 255)',
    padding: 16,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
    fontSize: 32,
  },
  version: {
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
    fontSize: 16,
  },
  instruction: {
    width: '100%',
    textAlign: 'center',
    letterSpacing: 1.5,
    lineHeight: 1.5,
    margin: '16px auto',
    fontSize: 16,
  },
}
