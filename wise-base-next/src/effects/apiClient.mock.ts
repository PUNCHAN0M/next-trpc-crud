import memoize from 'fast-memoize'
import { err, ok } from 'libs/result'
import { APIClient, ListPhotoResponse, ListTagResponse } from './apiClient'
import { Book } from 'modules/book'

export const getAPIClientMock = (): APIClient => ({
  listTags: jest.fn(),
  createTag: jest.fn(),
  deleteTag: jest.fn(),
  listPhotos: jest.fn(),
  listBook: jest.fn(),
  findOneBook: jest.fn(),
  createBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
})

export const getAPIClientInMemory = memoize((): APIClient => {
  let latestId = 0
  const tags: ListTagResponse[] = [
    { id: ++latestId, name: 'History' },
    { id: ++latestId, name: 'Science' },
    { id: ++latestId, name: 'Gaming' },
    { id: ++latestId, name: 'Phones' },
  ]
  latestId = 0
  const books: Book[] = [
    {
      id: String(++latestId),
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      numberPage: 100,
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      category: ['fiction', 'adventure'],
      author: {
        name: 'John Doe',
        age: 35,
        retired: false,
      },
    },
    {
      id: String(++latestId),
      title: 'reprehenderit est deserunt velit ipsam',
      numberPage: 150,
      details:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: ['science fiction'],
      author: {
        name: 'Jane Smith',
        age: 40,
        retired: true,
      },
    },
    {
      id: String(++latestId),
      title: 'officia porro iure quia iusto qui ipsa ut modi',
      numberPage: 120,
      details:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      category: ['mystery', 'thriller'],
      author: {
        name: 'Alice Johnson',
        age: 45,
        retired: false,
      },
    },
    {
      id: String(++latestId),
      title: 'culpa odio esse rerum omnis laboriosam voluptate repudiandae',
      numberPage: 200,
      details:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      category: ['fantasy'],
      author: {
        name: 'Michael Brown',
        age: 55,
        retired: true,
      },
    },
    {
      id: String(++latestId),
      title: 'natus nisi omnis corporis facere molestiae rerum in',
      numberPage: 180,
      details:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: ['romance'],
      author: {
        name: 'Emily Wilson',
        age: 30,
        retired: false,
      },
    },
  ]

  const photos: ListPhotoResponse[] = [
    {
      albumId: 1,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
    },
    {
      albumId: 1,
      id: 2,
      title: 'reprehenderit est deserunt velit ipsam',
      url: 'https://via.placeholder.com/600/771796',
      thumbnailUrl: 'https://via.placeholder.com/150/771796',
    },
    {
      albumId: 1,
      id: 3,
      title: 'officia porro iure quia iusto qui ipsa ut modi',
      url: 'https://via.placeholder.com/600/24f355',
      thumbnailUrl: 'https://via.placeholder.com/150/24f355',
    },
    {
      albumId: 1,
      id: 4,
      title: 'culpa odio esse rerum omnis laboriosam voluptate repudiandae',
      url: 'https://via.placeholder.com/600/d32776',
      thumbnailUrl: 'https://via.placeholder.com/150/d32776',
    },
    {
      albumId: 1,
      id: 5,
      title: 'natus nisi omnis corporis facere molestiae rerum in',
      url: 'https://via.placeholder.com/600/f66b97',
      thumbnailUrl: 'https://via.placeholder.com/150/f66b97',
    },
  ]
  return {
    listTags: ({ keyword }) => {
      return Promise.resolve(
        ok(
          keyword
            ? tags.filter((tag) =>
                tag.name.toLowerCase().includes(keyword.toLowerCase()),
              )
            : tags,
        ),
      )
    },
    createTag: ({ name }) => {
      tags.push({ id: ++latestId, name })
      return Promise.resolve(ok(undefined))
    },
    deleteTag: ({ id }) => {
      const index = tags.findIndex((tag) => tag.id === id)
      if (index < 0)
        return Promise.resolve(
          err(Error(`Specified tag not found with id: ${id}`)),
        )
      tags.splice(index, 1)
      return Promise.resolve(ok(undefined))
    },

    listPhotos: () => {
      return Promise.resolve(ok(photos))
    },
    listBook: () => {
      return Promise.resolve(ok(books))
    },
    findOneBook: ({ bookId }) => {
      const book = books.find((book) => book.id === bookId)
      if (!book) {
        return Promise.resolve(err(Error(`Book not found`)))
      }
      return Promise.resolve(ok(book))
    },
    deleteBook: ({ bookId }) => {
      const index = books.findIndex((book) => book.id  === bookId)
      if (index < 0)
        return Promise.resolve(
          err(Error(`Specified tag not found with id: ${bookId}`)),
        )
      books.splice(index, 1)      
      return Promise.resolve(ok(undefined))
    },
    createBook: (newBook) => { 
    
      books.push({
        id: String(++latestId), ...newBook,
        category: []
      });
      return Promise.resolve(ok(undefined));
    },
    
    updateBook: ({bookId},upbook) => {
      const updatebook = books.findIndex((book) => book.id  === bookId)
      books.splice(updatebook, 1)
      books.push({id: String(++latestId),...upbook});
      return Promise.resolve(ok(undefined))
    },

  }
})
