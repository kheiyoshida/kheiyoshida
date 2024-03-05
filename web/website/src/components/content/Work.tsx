import styles from '@/styles/components/content/Work.module.scss'
import { createContext, useContext } from 'react'
import { Slug } from '../../constants'
import { PageTypeContext } from '../../lib/context'
import { ContentPageInfo, ProjectPageInfo, WorkPageInfo } from '../../types'
import { Canvas } from './Canvas'
import { Embed } from './Embeds'
import { FooterInfo } from './Footer'
import { Images } from './Image'
import { Text } from './Text'
import { useSPALink } from '../../lib/route'

interface PagePropsBase<P extends ContentPageInfo> {
  content: P
  prev?: string | null
  next?: string | null
}

export type WorkPageProps = PagePropsBase<WorkPageInfo>
export type ProjectPageProps = PagePropsBase<ProjectPageInfo>
type PageProps = WorkPageProps | ProjectPageProps

export const PagePropsContext = createContext({} as PageProps)

export const ContentBlock = (props: WorkPageProps | ProjectPageProps) => {
  return (
    <PagePropsContext.Provider value={props}>
      <div className={styles.work}>
        <ContentTitle />
        <div className={styles.work__body}>{buildBody(props.content)}</div>
        <ContentFooter />
      </div>
    </PagePropsContext.Provider>
  )
}

const ContentTitle = () => {
  const { type } = useContext(PageTypeContext)
  const { content } = useContext(PagePropsContext)
  if (type !== 'project') return null
  return <div className={styles.work__title}>{`${content.title} (${content.date})`}</div>
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

const ContentFooter = () => {
  const { type } = useContext(PageTypeContext)
  if (type === 'project') return <ProjectPaginate />
  else return <FooterInfo />
}

const ProjectPaginate = () => {
  const { prev, next } = useContext(PagePropsContext)
  const handleClickLink = useSPALink()
  return (
    <div className={styles.work__paginate}>
      {prev ? (
        <a href={`/${Slug.projects}/${prev}`} onClick={handleClickLink}>
          ⇦
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={`/${Slug.projects}/${next}`} onClick={handleClickLink}>
          ⇨
        </a>
      ) : (
        <span />
      )}
    </div>
  )
}
