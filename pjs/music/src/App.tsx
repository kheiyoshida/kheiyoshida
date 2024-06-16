import { useEffect, useState } from 'react'
import { makeMusic as demo } from './pjs/demo'
import { makeMusic as maze } from './pjs/maze'
import { makeMusicGrid } from './ui/grid'

const Projects = {
  demo,
  maze
} as const

const App: React.FC = () => {
  const [pj, setPj] = useState(window.location.pathname)
  useEffect(() => {
    setPj(window.location.pathname.slice(1))
  }, [window.location.pathname])
  if (pj in Projects) {
    const makeMusic = Projects[pj as keyof typeof Projects]
    const Ui = makeMusicGrid(makeMusic)
    return <Ui />
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

export default App
