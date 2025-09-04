import { FntParser, UV } from './glyph'

describe(`${FntParser.name}`, () => {
  it(`parses .fnt file content as glyph data`, () => {
    const exampleFntContent = `info face="sans-serif" size=72 bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=1,1,1,1 spacing=1,1
common lineHeight=76 base=59 scaleW=512 scaleH=512 pages=1 packed=0
page id=0 file="ABCD.png"
chars count=5
char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=21 page=0 chnl=15
char id=65 x=51 y=0 width=50 height=55 xoffset=-1 yoffset=5 xadvance=49 page=0 chnl=15
char id=66 x=102 y=0 width=43 height=55 xoffset=4 yoffset=5 xadvance=49 page=0 chnl=15
char id=67 x=0 y=0 width=50 height=58 xoffset=1 yoffset=4 xadvance=52 page=0 chnl=15
char id=68 x=146 y=0 width=46 height=55 xoffset=4 yoffset=5 xadvance=52 page=0 chnl=15
    `
    const parser = new FntParser(exampleFntContent, { textureWidth: 512, textureHeight: 512 })

    const attributes = parser.getAttributes('A')
    expect(attributes).toEqual({
      uvMin: [0.099609375, 0.892578125],
      uvMax: [0.197265625, 1],
    } as UV)

    expect(() => parser.getAttributes('E')).toThrow()
  })
})
