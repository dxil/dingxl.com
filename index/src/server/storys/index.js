import {Axios} from '../axios'

export const storys = {
  getChapters: (bid='58dd09f6fdc4fd7606d9b3e3') => Axios('get', `api/storys/chapters?bid=${bid}`),
  getDetailByLink: (link) => Axios('get', `api/storys/detail?link=${link}`)

}
