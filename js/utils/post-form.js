import { setFieldValue, setBackgroudImg } from './common'

const setFormValue = (form, formValue) => {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)
  setBackgroudImg(document, '#postHeroImage', formValue?.imageUrl)
  setFieldValue(form, '[name="imgUrl"]', formValue?.imageUrl) // get url img (hiden)
}

const getFormValues = (form) => {
  const formValues = {}
  // case1
  // ;['title', 'author', 'description', 'imgUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValues[name] = field.value
  // })
  // case 2 using form data
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

export const initPostForm = ({ formId, defaultValue, onSubmit }) => {
  const form = document.getElementById(formId)
  setFormValue(form, defaultValue)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formValues = getFormValues(form)
    console.log(formValues)
  })
}


