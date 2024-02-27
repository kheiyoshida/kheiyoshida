import styles from '@/styles/components/Work.module.scss'
import Link from 'next/link'
import { Slug } from '../../constants'
import { ContentPageInfo } from '../../types'
import { Canvas } from './Canvas'
import { Embed } from './Embeds'
import { Images } from './Image'
import { Text } from './Text'

export interface WorkPageProps {
  work: ContentPageInfo
  prev?: string | null
  next?: string | null
  slug: Slug
}

export const FeedContentBlock = ({ work }: { work: ContentPageInfo }) => {
  return (
    <div className={styles.work}>
      <div className={styles.work__body}>{buildBody(work)}</div>
    </div>
  )
}

export const ContentBlock = ({ work, prev, next, slug }: WorkPageProps) => {
  return (
    <div className={styles.work}>
      <div className={styles.work__title}>{work.title.toUpperCase()}</div>
      <div className={styles.work__body}>{buildBody(work)}</div>
      <Paginate prev={prev} next={next} slug={slug} />
    </div>
  )
}

const buildBody = (work: ContentPageInfo) => {
  const body: JSX.Element[] = work.contents.flatMap((content, i) => {
    const k = `${work.title}-${i}`
    if (content.text) return content.text.map((text, j) => <Text key={k + j} text={text} />)
    if (content.embed) return content.embed.map((loc, j) => <Embed key={k + j} iFrame={loc} />)
    if (content.images)
      return <Images key={k} imagePaths={content.images} k={k} layout={work.options?.imageLayout} />
    if (content.sketch) return <Canvas sketch={content.sketch} />
    throw Error(`unresolved content: ${content}`)
  })
  return body
}

const Paginate = ({ prev, next, slug }: Pick<WorkPageProps, 'prev' | 'next' | 'slug'>) => (
  <div className={styles.work__paginate}>
    {prev ? <Link href={`/${slug}/${prev}`}>⇦</Link> : null}
    {next ? <Link href={`/${slug}/${next}`}>⇨</Link> : null}
  </div>
)
