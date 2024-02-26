import { PageTypeContext } from '@/lib/context'
import { retrieveImgAlt, retrieveImgLink } from '@/lib/image'
import styles from '@/styles/components/Image.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { Modal } from '../site/Modal'

export const Images = ({
  imagePaths,
  k,
  layout,
}: {
  imagePaths: string[]
  k: string
  layout?: ImageLayout
}) => {
  const { type } = useContext(PageTypeContext)
  const displayOff = type === 'feed'
  const [current, setCurrent] = useState<number>()
  return (
    <>
      {!displayOff && current !== undefined ? (
        <Display imagePaths={imagePaths} current={current} setCurrent={setCurrent} />
      ) : null}
      <div className={layout === 'row' ? styles.images__row : styles.images__grid}>
        {imagePaths.map((path, idx) => (
          <FlexibleImage
            key={`${k}-img-${idx}`}
            onClick={() => setCurrent(idx)}
            path={path}
            margin={type === 'work'}
            link={displayOff ? retrieveImgLink(path) : undefined}
          />
        ))}
      </div>
    </>
  )
}

const FlexibleImage = ({
  path,
  onClick,
  margin,
  link,
}: {
  path: string
  onClick: () => void
  margin: boolean
  link?: string
}) => {
  const [ratio, setRatio] = useState<string>()
  return (
    <div
      onClick={onClick}
      className={`${styles.images__item} ${margin ? styles.images__item__margin : ''}`}
      style={ratio ? { aspectRatio: ratio } : {}}
    >
      {link ? <Link href={link} className={styles.images__item__link} /> : null}
      <Image
        className={styles.images__item__img}
        src={path}
        alt={retrieveImgAlt(path)}
        fill
        onLoad={(e) => {
          const w = e.currentTarget.naturalWidth
          const h = e.currentTarget.naturalHeight
          setRatio(`${w}/${h}`)
        }}
      />
    </div>
  )
}

const Display = ({
  imagePaths,
  current,
  setCurrent,
}: {
  imagePaths: string[]
  current: number
  setCurrent: (idx: number | undefined) => void
}) => {
  const close = () => setCurrent(undefined)
  const [prevOk, nextOk] = [current !== 0, imagePaths.length - 1 !== current]
  const prev = () => prevOk && setCurrent(current - 1)
  const next = () => nextOk && setCurrent(current + 1)
  const path = imagePaths[current]
  return (
    <Modal close={close}>
      <div className={styles.display} onClick={close}>
        <div className={styles.display__img}>
          <Image onClick={(e) => e.stopPropagation()} src={path} alt={retrieveImgAlt(path)} fill />
        </div>
        <div className={styles.display__control} onClick={(e) => e.stopPropagation()}>
          <div onClick={prev} style={{ visibility: prevOk ? 'visible' : 'hidden' }}>
            ⇦
          </div>
          <div onClick={close}>●</div>
          <div onClick={next} style={{ visibility: nextOk ? 'visible' : 'hidden' }}>
            ⇨
          </div>
        </div>
      </div>
    </Modal>
  )
}
