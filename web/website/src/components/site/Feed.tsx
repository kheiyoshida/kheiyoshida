import { WorkBlock } from '../content/Work'
import styles from '@/styles/components/Feed.module.scss'
import Link from 'next/link'

export const Feed = ({ works }: { works: WorkInfoNew[] }) => {
  return (
    <div className={styles.feed}>
      {works.map((w) => (
        <div key={`feed-${w.date}`} className={styles.feed__item}>
          <WorkBlock work={makeExcerpt(w)} feed />
          <Link href={`/works/${w.date}`}>{w.title}</Link>
        </div>
      ))}
    </div>
  )
}

const ShownContentsInFeed = 1
const ShownImagesInFeed = 2

const makeExcerpt = (work: WorkInfoNew): WorkInfoNew => {
  const excerpt = { ...work, contents: work.contents.slice(0, ShownContentsInFeed) }
  if (excerpt.contents[0].images) {
    excerpt.contents[0].images = excerpt.contents[0].images.slice(0, ShownImagesInFeed)
  }
  return excerpt
}
