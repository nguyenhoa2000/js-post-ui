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
        (value) => value.split(' ').filter((item) => item.length > 3).length > 2
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
    console.log(error.inner)

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

export const initPostForm = ({ formId, defaultValue, onSubmit }) => {
  const form = document.getElementById(formId)
  setFormValue(form, defaultValue)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formValues = getFormValues(form)
    console.log(formValues)

    if (!validatePostForm(form, formValues)) return
  })
}
