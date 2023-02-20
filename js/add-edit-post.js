import postApi from './api/postApi'
import { initPostForm } from './utils'

const handlePostFormSubmit = async (formValues) => {
  try {
    let savePost = formValues.id
      ? await postApi.updateData(formValues)
      : await postApi.addData(formValues)

    window.location.assign(`/post-detail.html?id=${savePost.id}`)
  } catch (error) {
    console.log(error)
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
