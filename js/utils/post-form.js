import { setFieldValue, setBackgroudImg, setTextContent } from './common'
import * as yup from 'yup'

const getPostSchema = () => {
  return yup.object().shape({
    title: yup
      .string()
      .required('please enter title')
      .test(
        '',
        'Please enter at least 3 words',
        (value) => value.split(' ').filter((item) => item.length >= 2).length > 2
      ),
    author: yup
      .string()
      .required('please enter author')
      .test(
        '',
        'Please enter at least 10 characters',
        (value) =>
          value.split(' ').reduce((accumulator, item) => accumulator + item, '').length > 10
      ),
    description: yup.string(),
  })
}

const setFormValue = (form, defaultValue) => {
  setFieldValue(form, '[name="title"]', defaultValue?.title)
  setFieldValue(form, '[name="author"]', defaultValue?.author)
  setFieldValue(form, '[name="description"]', defaultValue?.description)
  setBackgroudImg(document, '#postHeroImage', defaultValue?.imageUrl)
  setFieldValue(form, '[name="imgUrl"]', defaultValue?.imageUrl) // get url img (hiden)
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

const setFieldError = (form, name, error) => {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

const validatePostForm = async (form, formValues) => {
  try {
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}
    for (const validationError of error.inner) {
      const name = validationError.path
      if (errorLog[name]) continue
      setFieldError(form, name, validationError.message)
      errorLog[name] = true
    }
  }

  const ivalid = form.checkValidity()
  if (!ivalid) form.classList.add('was-validated')
  return ivalid
}

const showLoading = (form) => {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

const hideLoading = (form) => {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

export const initPostForm = ({ formId, defaultValue, onSubmit }) => {
  const form = document.getElementById(formId)
  setFormValue(form, defaultValue)

  let sumitting = false

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (sumitting) return
    showLoading(form)
    sumitting = true

    const formValues = getFormValues(form)
    formValues.id = defaultValue.id
    const istrue = await validatePostForm(form, formValues)
    if (!istrue) return
    await onSubmit?.(formValues)
    hideLoading(form)
    sumitting = false
  })
}
