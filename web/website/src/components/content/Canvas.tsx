import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { Sketch } from '../../contents/data'

export const Canvas = ({ sketch }: { sketch: Sketch }) => {
  const SketchComponent = getSketchComponent(sketch)
  useEffect(preventScroll, [])
  return (
    <>
      <CnavasLoader />
      <SketchComponent />
    </>
  )
}

const getSketchComponent = (sketch: Sketch) => {
  switch (sketch) {
    case Sketch.wasted:
      return dynamic(() => import('sketch/src/projects/wasted'), { ssr: false })
    case Sketch.shinjuku:
      return dynamic(() => import('sketch/src/projects/shinjuku'), { ssr: false })
    case Sketch.forest:
      return dynamic(() => import('forest'), { ssr: false })
    case Sketch.maze:
      return dynamic(() => import('maze'), { ssr: false })
    case Sketch.regrets:
      return dynamic(() => import('sketch/src/projects/regrets'), { ssr: false })
    case Sketch.tp4:
      return dynamic(() => import('sketch/src/projects/tp4'), { ssr: false })
    default:
      throw Error(`couldn't resolve the sketch: ${sketch}`)
  }
}

const preventScroll = () => {
  document.body.style.position = 'fixed'
  document.body.style.top = '0'
}

const CnavasLoader = () => (
  <div style={loader}>
    <div style={text}>loading...</div>
  </div>
)

const loader: React.CSSProperties = {
  zIndex: 5,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: 'black',
}

const text: React.CSSProperties = {
  margin: '45vh auto',
  width: '100px',
}
