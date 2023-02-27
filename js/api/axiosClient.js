import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thêm một bộ đón chặn request
axiosClient.interceptors.request.use(
  (config) => {

    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = 'no access token'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Thêm một bộ đón chặn response
axiosClient.interceptors.response.use(
  (response) => {
    return response.data
  },

  (error) => {
    return Promise.reject(error)
  }
)

export default axiosClient
