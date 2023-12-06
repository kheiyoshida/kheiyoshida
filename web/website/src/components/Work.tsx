import { Images } from "./Image"
import { Embeds, OtherEmbed, SketchEmbed } from "./Embeds"
import styles from '@/styles/components/Work.module.scss'
import Link from "next/link";

export interface WorkPageProps {
  work: Work
  prev?: string | null
  next?: string | null
  feed?: boolean
}

const buildBody = (work: Work, feed: WorkPageProps['feed']) => {
  const body = work.type.map((t, idx) => {
    const key = `${work.date}-body-${idx}`
    switch (t) {
      case 'visual':
        return <VisualWork key={key} work={work} />
      case 'sketch':
        return <SketchWork key={key} work={work} feed={Boolean(feed)}/>
      case 'music':
        return <MusicWork key={key} work={work} />
      case 'video':
        return <VideoWork key={key} work={work} />
      case 'other':
        return <OtherWork key={key} work={work} />
    }
  })
  return body;
}

export const WorkBlock = ({work, prev, next, feed}: WorkPageProps) => {
  const body = buildBody(work, feed)
  return (
    <div className={styles.work}>
      {
        !feed 
          ? <div className={styles.work__title}>
            {work.date}/{work.title}
            </div>
          : null
      }
      <div className={styles.work__body}>
        {body}
      </div>
      {
        !feed 
          ? <div className={styles.work__description}>
            {work.description}
            </div>
          : null
      }
      <div className={styles.work__paginate}>
        {
          prev ? (<Link href={`/works/${prev}`}>⇦</Link>) : null
        }
        {
          next ? (<Link href={`/works/${next}`}>⇨</Link>) : null
        }
      </div>
    </div>
  )
}

interface WorkCp {
  work: Work
}

const VisualWork = ({work}: WorkCp) => {
  return (
    <>
      {
        work.imagePaths ? (
          <Images 
            imagePaths={work.imagePaths} 
            k={work.date}
            layout={work.layout || 'row'}
          />
        ) : null
      }
    </>
  )
}

const SketchWork = ({work, feed}: WorkCp & {feed: boolean}) => {
  
  const full = `https://sketch.kheiyoshida.com/${work.title}`
  const source = `https://github.com/kheiyoshida/sketch/tree/main/src/projects/${work.title}`
  return (
    <>
      <SketchEmbed title={work.title} k={work.date}/> 
      {
        !feed ? (
          <div>
            <div>
              fullscreen=<a href={full}>{full}</a>
            </div>
            <div>
              source=<a href={source}>{source}</a>
            </div>
          </div>
        ) : null
      }
    </>
  )
}

const MusicWork = ({work}: WorkCp) => {
  return (
    <>
      {
        work.musicLoc ? (
          <Embeds embeds={work.musicLoc} k={work.date}/> 
        ) : null
      }
    </>
  )
}

const VideoWork = ({work}: WorkCp) => {
  return (
    <>
      {
        work.videoLoc ? (
          <Embeds embeds={work.videoLoc} k={work.date}/> 
        ) : null
      }
    </>
  )
}

const OtherWork = ({work}: WorkCp) => {
  return <OtherEmbed title={work.title} k={work.date} info={work.info} /> 
}
