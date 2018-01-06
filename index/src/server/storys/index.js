import {Axios} from '../axios'

export const storys = {
  getChapters: (bid='5992d63326f4e7d8559170b9') => Axios('get', `api/storys/chapters?bid=${bid}`),
  getDetailByLink: (link) => Axios('get', `api/storys/detail?link=${link}`)

}
