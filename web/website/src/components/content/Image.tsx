import { PageTypeContext } from '@/lib/context'
import { retrieveImgAlt } from '@/lib/image'
import styles from '@/styles/components/Image.module.scss'
import Image from 'next/image'
import { useContext, useState } from 'react'
import { ImageInfo } from '../../types'

export const Images = ({ imageInfo }: { imageInfo: ImageInfo }) => {
  const { type } = useContext(PageTypeContext)
  return (
    <div className={imageInfo.layout === 'grid' ? styles.images__grid : styles.images__row}>
      {imageInfo.images.map(({ path, link }) => (
        <FlexibleImage
          key={`${retrieveImgAlt(path)}`}
          path={path}
          margin={type === 'work'}
          link={link}
        />
      ))}
    </div>
  )
}

const FlexibleImage = ({
  path,
  margin,
  link,
}: {
  path: string
  margin: boolean
  link?: string
}) => {
  const [ratio, setRatio] = useState<string>()
  return (
    <div
      className={`${styles.images__item} ${margin ? styles.images__item__margin : ''}`}
      style={ratio ? { aspectRatio: ratio } : {}}
    >
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
      />
    </div>
  )
}
