import { strict } from 'assert'
import { z } from 'zod'

const Authordetails = z.object({
  name: z.string(),
  age: z.number(),
  retired: z.boolean(),
})

export type author = z.infer<typeof Authordetails> 

export const bookScheme = z.object({
  id: z.string(),
  title: z.string(),
  numberPage: z.number(),
  details: z.string(),
  category: z.string().array(),
  author: Authordetails,
})

export type Book = z.infer<typeof bookScheme> 

export const bookQueryScheme = z.object({
  bookId:z.string()
})

export type bookQuery = z.infer<typeof bookQueryScheme>

export const createBookScheme = z.object({
  title: z.string(),
  numberPage: z.number(),
  details: z.string(),
  category: z.string().array(),
  author: Authordetails,
})
export type createBook = z.infer<typeof createBookScheme>