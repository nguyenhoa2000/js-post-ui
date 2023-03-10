import { setFieldValue, setBackgroudImg, setTextContent, randomNumber } from './common'
import * as yup from 'yup'
const ImageSourse = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

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
    imgSourse: yup
      .string()
      .required('please select image soure')
      .oneOf([ImageSourse.PICSUM, ImageSourse.UPLOAD], 'please select correct value'),

    imageUrl: yup.string().when('imgSourse', {
      is: ImageSourse.PICSUM,
      then: () => yup.string().required('please random img').url('plese enter a valid url'),
    }),

    image: yup.mixed().when('imgSourse', {
      is: ImageSourse.UPLOAD,
      then: () =>
        yup
          .mixed()
          .test('', 'please upload image', (file) => {
            if (!file?.name) return false
            else return true
          })
          .test('max-Size', 'please select an image <= 10mb', (file) => {
            const fileSize = file?.size || 0
            const MAX_SIZE = 10 * 1024 * 1024 // 10 mb
            return fileSize <= MAX_SIZE
          }),
    }),
  })
}

const setFormValue = (form, defaultValue) => {
  setFieldValue(form, '[name="title"]', defaultValue?.title)
  setFieldValue(form, '[name="author"]', defaultValue?.author)
  setFieldValue(form, '[name="description"]', defaultValue?.description)
  setBackgroudImg(document, '#postHeroImage', defaultValue?.imageUrl)
  setFieldValue(form, '[name="imageUrl"]', defaultValue?.imageUrl) // get url img (hiden)
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
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}
    if (error.name === 'ValidationError') {
      for (const validationError of error.inner) {
        const name = validationError.path
        if (errorLog[name]) continue
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  const ivalid = form.checkValidity()
  if (!ivalid) form.classList.add('was-validated')
  return ivalid
}

const validateFormField = async (form, formValue, name) => {
  try {
    setFieldError(form, name, '')
    const schema = getPostSchema()
    await schema.validateAt(name, formValue)
  } catch (error) {
    setFieldError(form, name, error.message)
  }
  const field = form.querySelector(`[name="${name}"]`)
  if (field && field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
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

const initRandomImg = (form) => {
  const ranDomImg = document.getElementById('postChangeImage')
  if (!ranDomImg) return

  ranDomImg.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    setBackgroudImg(document, '#postHeroImage', imageUrl)
    setFieldValue(form, '[name="imageUrl"]', imageUrl) // get url img (hiden)
  })
}

const initUploadImg = (form) => {
  const uploadImg = form.querySelector('[name="image"]')
  if (!uploadImg) return
  uploadImg.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      const urlImage = URL.createObjectURL(file)
      setBackgroudImg(document, '#postHeroImage', urlImage)
      validateFormField(
        form,
        {
          imageSource: ImageSourse.UPLOAD,
          image: file,
        },
        'image'
      )
    }
  })
}

const initValidationOnChange = (form) => {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) {
      field.addEventListener('input', (e) => {
        const newValue = e.target.value
        validateFormField(form, { [name]: newValue }, name)
      })
    }
  })
}

const renderImgSourseControl = (form, selectorValue) => {
  const controlList = form.querySelectorAll('[data-id="imageSourse"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectorValue
  })
}

const initRadioImgSourse = (form) => {
  const radioList = form.querySelectorAll('[name="imgSourse"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => renderImgSourseControl(form, e.target.value))
  })
}

export const initPostForm = ({ formId, defaultValue, onSubmit }) => {
  const form = document.getElementById(formId)
  setFormValue(form, defaultValue)

  let sumitting = false

  initRandomImg(form)
  initRadioImgSourse(form)
  initUploadImg(form)
  initValidationOnChange(form)
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (sumitting) return
    showLoading(form)
    sumitting = true

    const formValues = getFormValues(form)

    formValues.id = defaultValue.id
    const isTrue = await validatePostForm(form, formValues)

    if (isTrue) await onSubmit?.(formValues)

    hideLoading(form)
    sumitting = false
  })
}
