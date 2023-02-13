const showModal = (modalElement) => {
  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}
export const lightBox = ({ modalId, imgSelector, prevSelector, nextSelector }) => {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return
  // check function run once
  if (modalElement.dataset.lightBox) return
  const imgElement = modalElement.querySelector(imgSelector)
  const prevElement = modalElement.querySelector(prevSelector)
  const nextElement = modalElement.querySelector(nextSelector)

  if (!imgElement || !prevElement || !nextElement) return

  let imgList = []
  let currentIndex = 0
  const showImg = (index) => {
    imgElement.src = imgList[index].src
  }

  document.addEventListener('click', (e) => {
    const { target } = e
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album= "${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((value) => value === target)
    showImg(currentIndex)
    showModal(modalElement)
  })

  prevElement.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImg(currentIndex)
  })
  nextElement.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImg(currentIndex)
  })

  modalElement.dataset.lightBox = 'true'
}
