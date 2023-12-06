import { WorkBlock } from "./Work"
import styles from '@/styles/components/Feed.module.scss'
import Link from "next/link"

const excerpt = (work:Work) => {
  const th = 2
  if (work.imagePaths.length > th) {
    work.imagePaths = work.imagePaths.slice(0, th)
  }
  return work
}

export const Feed = ({works}:{works: Work[]}) => {
  return (
    <div className={styles.feed}>
      {
        works.map( w => (
          <div key={`feed-${w.date}`} className={styles.feed__item}>
            <WorkBlock 
              work={excerpt(w)} 
              feed
            />
            <Link href={`/works/${w.date}`}>
              {w.title} 
            </Link>
          </div>
        ))
      }
    </div>
  )
}