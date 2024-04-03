import { create } from 'domain'
import { ok, Result } from 'libs/result'
import { Book, bookQueryScheme, bookScheme } from 'modules/book'
import { Books } from 'pages/book'
import { publicProcedure, router } from 'trpc'
import { z } from 'zod'
import { manageTagRouter } from '../tags/manage'
import { manageBookRouter } from './manage'


export const bookRouter = router({
  list: publicProcedure.query(
    ({ ctx }): Promise<Result<Book[], Error>> => {
      return ctx.apiClient.listBook()
    },
  ),
  findOne: publicProcedure.input(bookQueryScheme)
    .query(({ ctx, input }): Promise<Result<Book, Error>> => {
      return ctx.apiClient.findOneBook(input)
    }),
    manage: manageBookRouter,
})


 