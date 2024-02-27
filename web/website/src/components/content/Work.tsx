import styles from '@/styles/components/Work.module.scss'
import { Slug } from '../../constants'
import { ContentPageInfo, ProjectPageInfo, WorkPageInfo } from '../../types'
import { Canvas } from './Canvas'
import { Embed } from './Embeds'
import { Images } from './Image'
import { Text } from './Text'

interface PageProps<P extends ContentPageInfo> {
  content: P
  prev?: string | null
  next?: string | null
  slug: Slug
}

export type WorkPageProps = PageProps<WorkPageInfo>
export type ProjectPageProps = PageProps<ProjectPageInfo>

export const FeedContentBlock = ({ work }: { work: WorkPageInfo }) => {
  return (
    <div className={styles.work}>
      <div className={styles.work__body}>
        <Images imageInfo={work.thumbnail} />
      </div>
    </div>
  )
}

export const ContentBlock = ({ content, prev, next, slug }: WorkPageProps | ProjectPageProps) => {
  return (
    <div className={styles.work}>
      <div className={styles.work__title}>{content.title.toUpperCase()}</div>
      <div className={styles.work__body}>{buildBody(content)}</div>
      <Paginate prev={prev} next={next} slug={slug} />
    </div>
  )
}

const buildBody = (work: WorkPageInfo | ProjectPageInfo) => {
  if (typeof work.contents === 'string')
    return <Canvas key={`${work.id}-sketch`} sketch={work.contents} />
  const body: JSX.Element[] = work.contents.flatMap((content, i) => {
    const k = `${work.title}-${i}`
    if (content.text) return <Text key={k} text={content.text} />
    if (content.embed) return content.embed.map((loc, j) => <Embed key={k + j} iFrame={loc} />)
    if (content.image) return <Images key={k} imageInfo={content.image} />
    throw Error(`unresolved content: ${content}`)
  })
  return body
}

const Paginate = ({ prev, next, slug }: Pick<WorkPageProps, 'prev' | 'next' | 'slug'>) => (
  <div className={styles.work__paginate}>
    {prev ? <a href={`/${slug}/${prev}`}>⇦</a> : null}
    {next ? <a href={`/${slug}/${next}`}>⇨</a> : null}
  </div>
)
