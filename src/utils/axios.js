import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error)
    return Promise.reject(error)
  }
)

export default instance 