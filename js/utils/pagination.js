export const renderPagination = ({pagination, elementId}) => {
  const ulPagination = document.querySelector(elementId)
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

export const handleEvenPagination = ({ elementId, onchange }) => {
  const ulPagination = document.querySelector(elementId)
  if (!ulPagination) return

  // listen event next and prev
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault()
      const ulPagination = document.querySelector(elementId)
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      if (page <= 1) return
      onchange?.(page - 1)
    })
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault()
      const ulPagination = document.querySelector(elementId)
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      const totalPages = Number.parseInt(ulPagination.dataset.totalPages)
      if (page >= totalPages) return
      onchange?.(page + 1)
    })
  }
}
