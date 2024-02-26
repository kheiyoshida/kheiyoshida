import { ContentBlock, FeedContentBlock } from '../content/Work'
import styles from '@/styles/components/Feed.module.scss'
import Link from 'next/link'
import { Slug } from '../../constants'

export const Feed = ({ works }: { works: ContentPageInfo[] }) => {
  return (
    <div className={styles.feed}>
      {works.map((w) => (
        <div key={`feed-${w.date}`} className={styles.feed__item}>
          <FeedContentBlock work={makeExcerpt(w)} />
          {w.contents[1]?.sketch ? (
            <a href={w.contents[1].sketch[0]}>{w.title}</a>
          ) : (
            <Link href={`/${Slug.works}/${w.id}`}>{w.title}</Link>
          )}
        </div>
      ))}
    </div>
  )
}

const ShownContentsInFeed = 1
const ShownImagesInFeed = 2

const makeExcerpt = (work: ContentPageInfo): ContentPageInfo => {
  const excerpt = { ...work, contents: work.contents.slice(0, ShownContentsInFeed) }
  if (excerpt.contents[0].images) {
    excerpt.contents[0].images = excerpt.contents[0].images.slice(0, ShownImagesInFeed)
  }
  return excerpt
}
