import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { handleLengText, setTextContent, setThumbnail } from './common'
// to use formNow function
dayjs.extend(relativeTime)

export const createElement = (post) => {
  if (!post) return

  // render post
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', handleLengText(post.description, 80))
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', (e) => {
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(e.target)) return
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  const editBtn = liElement.querySelector('[data-id="edit"]')
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }
  const removeBtn = liElement.querySelector('[data-id="remove"]')
  if(removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      const removeEvent = new CustomEvent('removePost', {
        bubbles: true,
        detail: post
      })
      removeBtn.dispatchEvent(removeEvent)
    })
  }
  return liElement
}

export const renderPosts = ({ data, elementId }) => {
  if (!Array.isArray(data)) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  ulElement.textContent = ''

  data.forEach((post, item) => {
    const liElement = createElement(post)
    ulElement.appendChild(liElement)
  })
}
