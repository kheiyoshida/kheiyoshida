import { WorkBlock, WorkPageProps } from '@/components/content/Work'
import { PageTypeContext } from '@/lib/context'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { WorkEntities } from '../../contents'

export default function Work(props: WorkPageProps) {
  return (
    <>
      {/* SEO meta needed */}
      <PageTypeContext.Provider value={{ type: 'work' }}>
        <WorkBlock {...props} />
      </PageTypeContext.Provider>
    </>
  )
}

interface PageParam extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths<PageParam> = () => {
  return {
    paths: WorkEntities.map((work) => ({
      params: {
        slug: work.date,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<WorkPageProps> = (ctx) => {
  const { slug } = ctx.params as PageParam
  const idx = WorkEntities.findIndex((e) => e.date === slug)!
  const work = WorkEntities[idx]
  const prev = WorkEntities[idx + 1]
  const next = WorkEntities[idx - 1]

  return {
    props: {
      work,
      prev: prev ? prev.date : null,
      next: next ? next.date : null,
    },
    revalidate: 1,
  }
}
