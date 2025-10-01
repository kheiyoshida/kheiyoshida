import { TextData } from '../presentation/glyph'
import { randomItemFromArray } from 'utils'

import aFnt from '../../../assets/fonts/A.fnt?raw'
import aFntUrl from '../../../assets/fonts/A.png?url'

import alphabetFnt from '../../../assets/fonts/Alphabets512.fnt?raw'
import alphabetUrl from '../../../assets/fonts/Alphabets512.png?url'

export class AATextData implements TextData {
  fnt: string = aFnt
  fontImageUrl: string = aFntUrl
  getNextGlyph(): string {
    return this.pickGlyph()
  }
  private As = 'Aあa亜ア阿 '.split('')
  private pickGlyph() {
    return randomItemFromArray(this.As)
  }
}

export class AlphabetTextData implements TextData {
  fnt: string = alphabetFnt
  fontImageUrl: string = alphabetUrl
  index = 0
  getNextGlyph(): string {
    this.index = (this.index + 1) % this.text.length
    return this.text[this.index]
  }
  constructor(public text: string) {}
}
