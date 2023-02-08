import debounce from 'lodash.debounce'
export const initSearch = ({ elementId, defaultParams, onchange }) => {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return
  if (defaultParams && defaultParams.get('title_like'))
    searchInput.value = defaultParams.get('title_like')
  const debounceSearch = debounce((e) => onchange?.(e.target.value), 500)
  searchInput.addEventListener('input', debounceSearch)
}
