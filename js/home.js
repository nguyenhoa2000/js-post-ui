import postApi from './api/postApi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, setThumbnail, handleLengText } from './utils/common'

// to use formNow function
dayjs.extend(relativeTime)

const renderPagination = (pagination) => {
  const ulPagination = document.querySelector('#postsPagination')
  if (!pagination || !ulPagination) return

  const { _page, _limit, _totalRows } = pagination
  const totalPage = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPage = totalPage

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPage) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

const handleFilterChange = async (filterName, filterValue) => {
 try {
  const url = new URL(window.location) // get url
  url.searchParams.set(filterName, filterValue) //set params
  window.history.pushState({}, '', url)

  // fetch api render posts
  const { data, pagination } = await postApi.getAll(url.searchParams)
  renderPosts(data)
  renderPagination(pagination)
 } catch (err) {
  console.error(err)
 }
}

const initUrl = () => {
  const url = new URL(window.location) // get url
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  window.history.pushState({}, '', url)
}

const handlePrevClick = (e) => {
  e.preventDefault()
  const ulPagination = document.querySelector('#postsPagination')
  if (!ulPagination) return
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}
const handleNextClick = (e) => {
  e.preventDefault()
  const ulPagination = document.querySelector('#postsPagination')
  if (!ulPagination) return
  const page = Number.parseInt(ulPagination.dataset.page) || 1 
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages)
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)

}

const handleEvenPagination = () => {
  const ulPagination = document.querySelector('#postsPagination')
  if (!ulPagination) return

  // listen event next and prev
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

const createElement = (post) => {
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

  return liElement
}

const renderPosts = (postList) => {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  ulElement.textContent = ''

  postList.forEach((post, item) => {
    const liElement = createElement(post)
    ulElement.appendChild(liElement)
  })
}

;(async () => {
  const queryParams = new URLSearchParams(window.location.search) // get params

  try {
    handleEvenPagination()
    initUrl()
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPosts(data)
    renderPagination(pagination)
  } catch (error) {
    console.log(error)
  }
})()
