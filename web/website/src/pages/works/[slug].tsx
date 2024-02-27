import { ContentBlock, WorkPageProps } from '@/components/content/Work'
import { PageTypeContext } from '@/lib/context'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { WorkEntities } from '../../contents/works'
import { Slug } from '../../constants'

export default function Work(props: WorkPageProps) {
  return (
    <>
      {/* SEO meta needed */}
      <PageTypeContext.Provider value={{ type: 'work' }}>
        <ContentBlock {...props} />
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
        slug: work.id,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<WorkPageProps> = (ctx) => {
  const { slug } = ctx.params as PageParam
  const idx = WorkEntities.findIndex((e) => e.id === slug)!

  const content = WorkEntities[idx]
  const prev = WorkEntities[idx + 1]
  const next = WorkEntities[idx - 1]

  return {
    props: {
      content,
      prev: prev ? prev.id : null,
      next: next ? next.id : null,
      slug: Slug.works
    },
    revalidate: 1,
  }
}
