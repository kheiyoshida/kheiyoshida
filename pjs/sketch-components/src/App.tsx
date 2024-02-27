import { useEffect, useState } from 'react'
import Pj1 from './projects/pj1'

export default () => {
  const [pj, setPj] = useState('1')
  useEffect(() => {
    setPj(window.location.pathname.slice(1))
  }, [window.location.pathname])
  return pj === '1' ? <Pj1 /> : <div />
}
