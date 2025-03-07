import { useEffect, useState } from 'react'
import Mgnr from './labs/mgnr'
import Synth from './labs/synth'

const Projects = {
  synth: <Synth />,
  mgnr: <Mgnr />,
} as const

export default () => {
  const [pj, setPj] = useState(window.location.pathname)
  useEffect(() => {
    setPj(window.location.pathname.slice(1))
  }, [window.location.pathname])
  if (pj in Projects) {
    return Projects[pj as keyof typeof Projects]
  }
  return (
    <div>
      {Object.keys(Projects).map((k, i) => (
        <div key={i} style={{ margin: 8 }}>
          <a href={k}>{k}</a>
        </div>
      ))}
    </div>
  )
}
