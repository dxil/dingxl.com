import {Axios} from '../axios'

export const storys = {
  getChapters: (url) => Axios('get', `api/storys/chapters?url=${url}`),
  getDetailByLink: (link) => Axios('get', `api/storys/detail?url=${link}`),
  searchBook: (query) => Axios('get', `api/storys/search?q=${query}`)
}
