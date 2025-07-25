import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // cookie-based auth
})

export default api
