import { published } from './pub'



export const home = () => {
  head()
  pages()
}

const head = () => {
  const h1 = document.createElement('h1')
  h1.innerText = 'sketch.kheiyoshida.com'
  document.body.appendChild(h1)
}

const pages = () => {
  const ul = document.createElement('div')
  ul.style.display = 'grid'
  ul.style.gridTemplateColumns = 'repeat(3, 1fr)'
  ul.style.width = '100vw'
  published.forEach((w) => ul.appendChild(genPage(w)))
  document.body.appendChild(ul)
}

const genPage = (path: string) => {
  const li = document.createElement('div')
  li.style.margin = '16px'
  const a = document.createElement('a')
  a.href = path
  a.innerText = path
  li.appendChild(a)
  return li
}
