import styles from '@/styles/components/site/Feed.module.scss'
import stylesWork from '@/styles/components/Work.module.scss'
import { WorkPageInfo } from '../../types'
import { Images } from '../content/Image'

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

export const FeedContentBlock = ({ work }: { work: WorkPageInfo }) => {
  return (
    <div className={stylesWork.work}>
      <div className={stylesWork.work__body}>
        <Images imageInfo={work.thumbnail} />
      </div>
    </div>
  )
}
