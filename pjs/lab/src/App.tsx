import { useEffect, useState } from 'react'
import Lab from './labs/3d'
import Synth from './labs/synth'
import Mgnr from './labs/mgnr'
import Theme from './labs/theme'

const Projects = {
  '3d': <Lab />,
  synth: <Synth />,
  mgnr: <Mgnr />,
  theme: <Theme />,
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
