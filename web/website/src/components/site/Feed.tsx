import styles from '@/styles/components/site/Feed.module.scss'
import { WorkPageInfo } from '../../types'
import { Images } from '../content/Image'

export const Feed = ({ works }: { works: WorkPageInfo[] }) => {
  return (
    <div className={styles.feed}>
      {works.map((w, i) => (
        <div key={`feed-${w.id}`} className={styles.feed__item}>
          <Images imageInfo={{ ...w.thumbnail, priority: i < 3 }} />
        </div>
      ))}
    </div>
  )
}
