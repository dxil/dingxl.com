import axios from 'axios'
import {baseUrl} from '../config'

axios.defaults.baseURL = baseUrl;

// axios.interceptors.response.use(function(response){
//   //对响应数据做些事
//   // console.log(response.data)
//   return response;
// },function(error){
//   //请求错误时做些事
//   return Promise.reject(error);
// });

export const Axios = async(type = 'get', url = '', data = {}, headers = {
  'content-type': 'application/json'
}) => {
  let config = {
    method: type,
    url: url,
    headers: headers
  }
  // console.log(config)
  switch (type) {
    case 'post':
      config['data'] = data
      break
    case 'put':
      config['data'] = data
      break
  }
  try {
    var response = await axios.request(config)
  } catch (error) {
    throw new Error(error)
  }
  // console.log(response.data)
  return response.data
}

