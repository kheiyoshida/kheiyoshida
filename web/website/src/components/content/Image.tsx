import { imageKitLoader, retrieveImgAlt } from '@/lib/image'
import styles from '@/styles/components/content/Image.module.scss'
import Image from 'next/image'
import { SyntheticEvent, useState } from 'react'
import { MaxContentWidth } from '../../constants'
import { ImageInfo, ImgData } from '../../types'
import { Loading } from '../site/Loading'

export const Images = ({ imageInfo }: { imageInfo: ImageInfo }) => {
  return (
    <div className={imageInfo.layout === 'grid' ? styles.images__grid : styles.images__row}>
      {imageInfo.images.map((imgData) => (
        <FlexibleImage
          key={`${retrieveImgAlt(imgData.path)}`}
          {...{ ...imgData, priority: imageInfo.priority }}
        />
      ))}
    </div>
  )
}

export const FlexibleImage = ({
  path,
  link,
  placeholderPath,
  priority,
}: ImgData & { priority?: boolean }) => {
  const [ratio, setRatio] = useState<string>()
  const [imgLoaded, setLoaded] = useState(false)
  const setLoadedImageAspectRatio = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const w = e.currentTarget.naturalWidth
    const h = e.currentTarget.naturalHeight
    setRatio(`${w}/${h}`)
  }
  return (
    <div
      className={styles.images__item}
      style={ratio ? { aspectRatio: ratio } : { aspectRatio: 4 / 3 }}
    >
      {link ? <a href={link} className={styles.images__item__link} /> : null}
      <CustomImage
        path={path}
        priority={priority}
        onLoad={(e) => {
          setLoadedImageAspectRatio(e)
          setLoaded(true)
        }}
      />
      {imgLoaded === false ? (
        <Placeholder
          placeholderPath={placeholderPath}
          setRatio={setLoadedImageAspectRatio}
          priority={priority}
        />
      ) : null}
    </div>
  )
}

const Placeholder = ({
  placeholderPath,
  setRatio,
  priority = false,
}: {
  placeholderPath: string | null | undefined
  setRatio: (e: React.SyntheticEvent<HTMLImageElement>) => void
  priority?: boolean
}) => {
  const [phLoaded, setPHLoaded] = useState(false)
  return (
    <>
      {placeholderPath ? (
        <CustomImage
          path={placeholderPath}
          priority={priority}
          onLoad={(e) => {
            setRatio(e)
            setPHLoaded(true)
          }}
        />
      ) : null}
      {!phLoaded ? <Loading /> : null}
    </>
  )
}

const CustomImage = ({
  path,
  onLoad,
  priority = false,
}: {
  path: string
  onLoad: (e: SyntheticEvent<HTMLImageElement, Event>) => void
  priority?: boolean
}) => {
  return (
    <Image
      className={styles.images__item__img}
      src={path}
      alt={retrieveImgAlt(path)}
      fill
      priority={priority}
      loader={imageKitLoader}
      onLoad={onLoad}
      sizes={`(max-width: ${MaxContentWidth}px) 100vw, ${MaxContentWidth}px`}
    />
  )
}
