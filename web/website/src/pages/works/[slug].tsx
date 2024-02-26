import { WorkBlock, WorkPageProps } from '@/components/Work'
import { PageTypeContext } from '@/lib/context'
import { resolveWorkInfo } from '@/lib/image'
import workEntities from '@/works'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

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
    paths: workEntities.map((work) => ({
      params: {
        slug: work.date,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<WorkPageProps> = (ctx) => {
  const { slug } = ctx.params as PageParam
  const idx = workEntities.findIndex((e) => e.date === slug)!
  const work = resolveWorkInfo(workEntities[idx])
  const prev = workEntities[idx + 1]
  const next = workEntities[idx - 1]

  return {
    props: {
      work,
      prev: prev ? prev.date : null,
      next: next ? next.date : null,
    },
    revalidate: 1,
  }
}
