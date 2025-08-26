
export class Message{
  readonly div: HTMLDivElement

  constructor() {
    this.div = document.getElementById('message')! as HTMLDivElement
  }

  set text(value: string) {
    this.div.textContent = value
  }

  hide() {
    this.div.style.display = 'none'
  }
}
