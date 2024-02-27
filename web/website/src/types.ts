import { Sketch } from './contents/data'

export type OnePartial<R extends Record<string, unknown>, K extends keyof R> = Omit<R, K> &
  Partial<Pick<R, K>>
export type WithoutId<C extends ContentPageInfo> = OnePartial<C, 'id'>

export type ContentPageInfo = {
  id: string
  title: string
  date: string // YYMMDD
}
export type ProjectPageInfo = ContentPageInfo & {
  contents: PageContent[]
}
export type WorkPageInfo = ContentPageInfo & {
  thumbnail: ImageInfo
  caption?: string
  contents: Sketch | PageContent[]
}

export type PageContent = {
  text?: string
  image?: ImageInfo
  embed?: string[]
}

export type ImageInfo = {
  images: ImgData[]
  layout?: ImageLayout
}

export type ImgData = {
  path: string
  link?: string
}

export type ImageLayout = 'row' | 'grid'
