import { Sketch } from './contents/data'

export type OnePartial<R extends Record<string, unknown>, K extends keyof R> = Omit<R, K> &
  Partial<Pick<R, K>>
export type ContentWithoutId = OnePartial<ContentPageInfo, 'id'>

export type ContentPageInfo = {
  id: string
  title: string
  date: string // YYMMDD
  contents: PageContent[]
  options?: {
    imageLayout?: ImageLayout
  }
}

export type PageContent = {
  text?: string[]
  images?: string[]
  embed?: string[]
  sketch?: Sketch
}

export type ContentType = 'text' | 'images' | 'embed' | 'sketch'

export type ImageLayout = 'row' | 'grid'
