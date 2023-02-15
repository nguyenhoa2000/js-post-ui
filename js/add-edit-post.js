import postApi from './api/postApi'
import { initPostForm } from './utils'
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
        console.log(defaultValue)
    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: (formValue) => {
        console.log('test')
      },
    })
  } catch (error) {
    console.log(error)
  }
})()
