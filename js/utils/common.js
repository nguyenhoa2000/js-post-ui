export const setTextContent = (parent, selector, text) => {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
  return
}

export const setThumbnail = (parent, selector, thumbnail) => {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) {
    element.src = thumbnail

    element.addEventListener('error', () => {
      element.src = `https://via.placeholder.com/1368x60?text=thumbnail`
    })
  }
  return
}

export const handleLengText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

export const setFieldValue = (form, selector, value) => {
  if (!form) return

  const field = form.querySelector(selector)
  if (field) field.value = value
  return
}

export const setBackgroudImg = (parent, selector, imgUrl) => {
  if (!parent) return
  const element = parent.querySelector(selector)
  if (element) element.style.backgroundImage = `url("${imgUrl}")`
}

export const randomNumber = (n) => {
  if(n <= 0) return -1
  const random = Math.random() * n 
  return Math.round(random)
}

