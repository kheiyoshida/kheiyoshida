import { useEffect, useState } from 'react'
import Regrets_revisited from './projects/regrets'
import Shinjuku from './projects/shinjuku'
import SurfaceWater from './projects/surface-water'
import Tp4 from './projects/tp4'
import Wasted_revisited from './projects/wasted'

const Projects = {
  regrets_revisited: <Regrets_revisited />,
  shinjuku: <Shinjuku />,
  tp4: <Tp4 />,
  wasted_revisited: <Wasted_revisited />,
  'suface-water': <SurfaceWater />,
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
