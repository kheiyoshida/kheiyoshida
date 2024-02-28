import styles from '@/styles/components/Footer.module.scss'
import { useContext, useEffect, useState } from 'react'
import { PagePropsContext, WorkPageProps } from './Work'
import { Slug } from '../../constants'
import { Text } from './Text'

const useFooter = () => {
  const [isExpanded, setExpanded] = useState(false)
  useEffect(() => {
    setExpanded(true)
  }, [])
  const expand = () => setExpanded(true)
  const shrink = () => setExpanded(false)
  const toggle = () => setExpanded((isExpanded) => !isExpanded)
  return { isExpanded, expand, shrink, toggle }
}

export const FooterInfo = () => {
  const { isExpanded, toggle } = useFooter()
  return (
    <div className={styles.footer} onClick={toggle}>
      {isExpanded ? <FooterExpanded /> : <FooterShrank />}
    </div>
  )
}

export const FooterExpanded = () => {
  const { content: work, prev, next } = useContext(PagePropsContext) as WorkPageProps
  return (
    <div className={styles.footer__expanded}>
      <div>{`${work.title} (20${work.date.slice(0, 2)})`}</div>
      {work.caption ? <Text text={work.caption} /> : <span />}
      <div className={styles.footer__expanded__nav}>
        <div>
          {prev ? <a href={`/${Slug.works}/${prev}`}>←</a> : <span />}
          {next ? <a href={`/${Slug.works}/${next}`}>→</a> : <span />}
        </div>
        <span>×</span>
      </div>
    </div>
  )
}
export const FooterShrank = () => {
  const {
    content: { title },
  } = useContext(PagePropsContext)
  return <div className={styles.footer__shrank}>{title}</div>
}
