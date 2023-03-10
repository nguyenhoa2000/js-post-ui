import axiosClient from './axiosClient'

const studentApi = {
  getAll(params) {
    const url = '/students'
    return axiosClient.get(url,{params})
  },

  getById(id) {
    const url = `/students/${id}`
    return axiosClient.get(url)
  },

  addData(data) {
    const url = '/students'
    return axiosClient.post(url, data)
  },

  updateData(data) {
    const url = `/students/${data.id}`
    return axiosClient.patch(url, data)
  },

  removeData(id) {
    const url = `/students/${id}`
    return axiosClient.delete(url)
  },
}

export default studentApi
