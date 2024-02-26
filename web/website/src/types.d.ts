type OnePartial<R extends Record, K extends keyof R> = Omit<R, K> & Partial<Pick<R, K>>
type ContentWithoutId = OnePartial<ContentPageInfo, 'id'>

type ContentPageInfo = {
  id: string
  title: string
  date: string // YYMMDD
  contents: PageContent[]
  options?: {
    imageLayout?: ImageLayout
  }
}

type PageContent = {
  [k in ContentType]?: string[]
}

type ContentType = 'text' | 'images' | 'embed' | 'sketch'

type ImageLayout = 'row' | 'grid'
