import { ContentBlock, WorkPageProps } from '@/components/content/Work'
import { PageTypeContext } from '@/lib/context'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { ProjectEntities } from '../../contents/projects'
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
    paths: ProjectEntities.map((pj) => ({
      params: {
        slug: pj.id,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<WorkPageProps> = (ctx) => {
  const { slug } = ctx.params as PageParam
  const idx = ProjectEntities.findIndex((e) => e.id === slug)!

  const work = ProjectEntities[idx]
  const prev = ProjectEntities[idx + 1]
  const next = ProjectEntities[idx - 1]

  return {
    props: {
      work,
      prev: prev ? prev.id : null,
      next: next ? next.id : null,
      slug: Slug.projects,
    },
    revalidate: 1,
  }
}
