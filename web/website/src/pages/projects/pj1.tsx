import dynamic from 'next/dynamic'

const Pj1 = dynamic(() => import('sketch-components/src/projects/pj1'), { ssr: false })

export default function () {
  return (
    <div>
      <Pj1 />
    </div>
  )
}
