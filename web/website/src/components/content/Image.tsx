import { retrieveImgAlt } from '@/lib/image'
import styles from '@/styles/components/content/Image.module.scss'
import Image from 'next/image'
import { useState } from 'react'
import { ImageInfo } from '../../types'
import { MaxContentWidth } from '../../constants'

export const Images = ({ imageInfo }: { imageInfo: ImageInfo }) => {
  return (
    <div className={imageInfo.layout === 'grid' ? styles.images__grid : styles.images__row}>
      {imageInfo.images.map(({ path, link }) => (
        <FlexibleImage key={`${retrieveImgAlt(path)}`} path={path} link={link} />
      ))}
    </div>
  )
}

export const FlexibleImage = ({ path, link }: { path: string; link?: string }) => {
  const [ratio, setRatio] = useState<string>()
  return (
    <div className={styles.images__item} style={ratio ? { aspectRatio: ratio } : {}}>
      {link ? <a href={link} className={styles.images__item__link} /> : null}
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
        sizes={`(max-width: ${MaxContentWidth}px) 100vw, ${MaxContentWidth}px`}
      />
    </div>
  )
}
