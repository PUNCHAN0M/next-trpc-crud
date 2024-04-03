import { Result } from 'libs/result'
import { Book, bookQuery, bookScheme, createBook } from 'modules/book'
import { BooksPageProps } from 'pages/book'
import { z } from 'zod'

export type APIClient = {
  listTags: (input: {
    keyword?: string | undefined
  }) => Promise<Result<ListTagResponse[], Error>>
  createTag: (input: { name: string }) => Promise<Result<void, Error>>
  deleteTag: (input: { id: number }) => Promise<Result<void, Error>>
  listPhotos: () => Promise<Result<ListPhotoResponse[], Error>>
  listBook: () => Promise<Result<Book[], Error>>
  findOneBook: (input: { bookId: string }) => Promise<Result<Book, Error>>
  createBook: (input: createBook) => Promise<Result<void, Error>>
  updateBook: (input: { bookId: string},upbook: createBook ) => Promise<Result<void, Error>>
  deleteBook: (input: { bookId: string }) => Promise<Result<void, Error>>


}

export const listTagResponseScheme = z.object({
  id: z.number(),
  name: z.string(),
})

export type ListTagResponse = z.infer<typeof listTagResponseScheme>

export const listPhotoResponseScheme = z.object({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
})

export type ListPhotoResponse = z.infer<typeof listPhotoResponseScheme>

