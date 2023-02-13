import dayjs from 'dayjs'
import postApi from './api/postApi'
import { lightBox, setTextContent } from './utils'

const renderPostDetail = (post) => {
  if (!post) return

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  )
  // imgPostDetail
  const heroImgDetail = document.getElementById('postHeroImage')
  if (heroImgDetail) {
    Object.assign(heroImgDetail.style, {
      background: `url("${post.imageUrl}")`,
    })
  }

  // render edit post
  const editLInk = document.getElementById('goToEditPageLink')
  if (editLInk) {
    editLInk.innerHTML = '<i class="fas fa-edit"></i> Edit post'
  }
}

;(async () => {
  lightBox({
    modalId: 'light-box',
    imgSelector: '[data-id="lightBoxImg"]',
    prevSelector: 'button[data-id="prev"]',
    nextSelector: 'button[data-id="next"]',
  })
  try {
    const searchPrams = new URLSearchParams(window.location.search)
    const postId = searchPrams.get('id')

    const post = await postApi.getById(postId)
    renderPostDetail(post)
  } catch (error) {
    console.error(error)
  }
})()
