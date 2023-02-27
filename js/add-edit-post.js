import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

const removeUnUsedFields = (formValues) => {
  const payload = { ...formValues }

  if (payload.imgSourse === 'picsum') {
    delete payload.image
  }
  if (payload.imgSourse === 'upload') {
    delete payload.imageUrl
  }

  delete payload.imgSourse
  if (!payload.id) delete payload.id
  return payload
}

const jsonToFormData = (jsonObject) => {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }
  return formData
}

const handlePostFormSubmit = async (formValues) => {
  try {
    const payLoad = removeUnUsedFields(formValues)

    const formData = jsonToFormData(payLoad)
    let savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)
    toast.success('update successly')
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 2000)
  } catch (error) {
    toast.error(error.message)
  }
}
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    let defaultValue
    defaultValue = postId
      ? (defaultValue = await postApi.getById(postId))
      : (defaultValue = {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        })

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log(error)
  }
})()
