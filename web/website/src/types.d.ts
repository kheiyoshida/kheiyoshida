type Work = {
  title: string
  date: string // YYMMDD
  contents: WorkContent[]
  options?: {
    imageLayout?: ImageLayout
  }
}

type WorkContent = {
  [k in WorkContentType]?: string[]
}

type WorkContentType = 'text' | 'images' | 'embed' | 'sketch'

type ImageLayout = 'row' | 'grid'
