import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'
import { Sketch } from '../../contents/data'

export const Canvas = ({ sketch }: { sketch: Sketch }) => {
  const SketchComponent = useMemo(() => getSketchComponent(sketch), [sketch])
  return <SketchComponent />
}

const getSketchComponent = (sketch: Sketch) => {
  switch (sketch) {
    case Sketch.wasted:
      return dynamic(() => import('sketch/src/projects/wasted_revisited'), { ssr: false })
    case Sketch.shinjuku:
      return dynamic(() => import('sketch/src/projects/shinjuku'), { ssr: false })
    case Sketch.forest:
      return dynamic(() => import('sketch/src/projects/mgnr-demo'), { ssr: false })
    case Sketch.maze:
      throw Error(`not implemented`)
    case Sketch.regrets:
      return dynamic(() => import('sketch/src/projects/regrets'), { ssr: false })
    case Sketch.tp4:
      return dynamic(() => import('sketch/src/projects/tp4'), { ssr: false })
    default:
      return () => <div>{sketch}</div>
      throw Error(`couldn't resolve the sketch: ${sketch}`)
  }
}
