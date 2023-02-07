import postApi from './api/postApi'

const main = async () => {
  const queryParams = {
    _page: 1,
    _limit: 5,
  }
  const id = 'lea2aa9l7x3a5tg'
  const data1 = {
    title: 'test3',
    author: 'it me',
    description: 'test description',
    imageUrl: 'https://picsum.photos/id/559/1368/400',
  }

  try {
    const data = await postApi.getAll()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

main()
