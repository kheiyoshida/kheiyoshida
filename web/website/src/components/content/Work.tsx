import styles from '@/styles/components/Work.module.scss'
import Link from 'next/link'
import { resolveImagekitPath } from '../../lib/image'
import { Embed, SketchEmbed } from './Embeds'
import { Images } from './Image'
import { Text } from './Text'

export interface WorkPageProps {
  work: WorkInfoNew
  prev?: string | null
  next?: string | null
  feed?: boolean
}

export const WorkBlock = ({ work, prev, next, feed }: WorkPageProps) => {
  return (
    <div className={styles.work}>
      {!feed ? (
        <div className={styles.work__title}>
          {work.date}/{work.title}
        </div>
      ) : null}
      <div className={styles.work__body}>{buildBody(work)}</div>
      <div className={styles.work__paginate}>
        {prev ? <Link href={`/works/${prev}`}>⇦</Link> : null}
        {next ? <Link href={`/works/${next}`}>⇨</Link> : null}
      </div>
    </div>
  )
}

const buildBody = (work: WorkInfoNew) => {
  const body: JSX.Element[] = work.contents.flatMap((content, i) => {
    const k = `${work.title}-${i}`
    if (content.text) return content.text.map((text, j) => <Text key={k + j} text={text} />)
    if (content.embed) return content.embed.map((loc, j) => <Embed key={k + j} iFrame={loc} />)
    if (content.images)
      return (
        <Images key={k} imagePaths={resolveImagekitPath(content.images, work.date)} k={k} layout="row" />
      )
    if (content.sketch)
      return content.sketch.map((link, j) => <SketchEmbed key={k + j} link={link} />)
    throw Error(`unresolved content: ${content}`)
  })
  return body
}
