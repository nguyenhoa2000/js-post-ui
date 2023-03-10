import axiosClient from './axiosClient'

const postApi = {
  getAll(params = '') {
    const url = '/posts'
    return axiosClient.get(url, { params})
  },

  getById(id) {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },

  addData(data) {
    const url = '/posts'
    return axiosClient.post(url, data)
  },

  updateData(data) {
    const url = `/posts/${data.id}`
    return axiosClient.patch(url, data)
  },

  addFormData (data) {
    const url = `/with-thumbnail/posts`
    return axiosClient.post(url, data, {
      headers:{
        'content-type': 'multipart/form-data'
      }
    })
  },
  updateFormData (data) {
    const url = `/with-thumbnail/posts/${data.get('id')}`
    return axiosClient.patch(url, data, {
      headers:{
        'content-type': 'multipart/form-data'
      }
    })
  },

  removeData(id) {
    const url = `/posts/${id}`
    return axiosClient.delete(url)
  },
}

export default postApi
