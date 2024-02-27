import { useEffect, useState } from 'react'
import Rebirth from './projects/rebirth'
import Lab from './projects/3d_lab'
import Gen from './projects/gen'
import Forest from './projects/mgnr-demo'
import Regrets from './projects/regrets'
import Shinjuku from './projects/shinjuku'
import Spiders from './projects/spiders'
import Tp4 from './projects/tp4'
import Wasted_revisited from './projects/wasted_revisited'
import Wasted from './projects/wasted'

const Projects = {
  rebirth: <Rebirth />,
  '3d_lab': <Lab />,
  gen: <Gen />,
  forest: <Forest />,
  regrets: <Regrets />,
  shinjuku: <Shinjuku />,
  spiders: <Spiders />,
  tp4: <Tp4 />,
  wasted_revisited: <Wasted_revisited />,
  wasted: <Wasted />
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
