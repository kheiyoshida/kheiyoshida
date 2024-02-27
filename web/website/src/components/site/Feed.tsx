import styles from '@/styles/components/Feed.module.scss'
import { WorkPageInfo } from '../../types'
import { FeedContentBlock } from '../content/Work'

export const Feed = ({ works }: { works: WorkPageInfo[] }) => {
  return (
    <div className={styles.feed}>
      {works.map((w) => (
        <div key={`feed-${w.date}`} className={styles.feed__item}>
          <FeedContentBlock work={w} />
        </div>
      ))}
    </div>
  )
}
