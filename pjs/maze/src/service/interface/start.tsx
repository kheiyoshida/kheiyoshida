import { useState } from "react"

export const Start = ({version}: {version: string}) => {
  const [started, setStarted] = useState(false)
  return !started ? (
    <div style={styles.container} onClick={() => setStarted(true)}>
      <div style={styles.title}>MAZE</div>
      <div style={styles.version}>{version}</div>
    </div>
  ) : null
}

const styles: Record<string,React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255)'
  },
  title: {
    fontSize: 32,
  },
  version: {}
}