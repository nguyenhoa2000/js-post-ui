import postApi from './api/postApi'
import { handleEvenPagination, initSearch, renderPagination, renderPosts, toast } from './utils'

const handleFilterChange = async (filterName, filterValue) => {
  try {
    const url = new URL(window.location) // get url
    if (filterName) url.searchParams.set(filterName, filterValue) //set params
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    window.history.pushState({}, '', url)

    // fetch api render posts
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPosts({ data, elementId: 'postList' })
    renderPagination({
      pagination,
      elementId: '#postsPagination',
    })
  } catch (err) {
    console.error(err)
  }
}

const initUrl = () => {
  const url = new URL(window.location) // get url
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  window.history.pushState({}, '', url)
  return url.searchParams
}

const handleDeletePost = () => {
  document.addEventListener('removePost', async (e) => {
    try {
      const post = e.detail
      const message = 'Are you sure delete this post'
      if(window.confirm(message)) {
        await postApi.removeData(post.id)
        await handleFilterChange()
        toast.success('delete post successfully')
      }
     
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  })
}

;(async () => {
  const queryParams = initUrl()
  handleDeletePost()
  handleEvenPagination({
    elementId: '#postsPagination',
    defaultParams: queryParams,
    onchange: (page) => handleFilterChange('_page', page),
  })
  initSearch({
    elementId: 'search-input',
    defaultParams: queryParams,
    onchange: (value) => handleFilterChange('title_like', value),
  })

  try {
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPosts({ data, elementId: 'postList' })
    renderPagination(pagination)
  } catch (error) {
    console.log(error)
  }
})()
