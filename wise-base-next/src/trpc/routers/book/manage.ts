import { Result } from 'libs/result'
import { Book, bookQueryScheme, bookScheme, createBookScheme } from 'modules/book'
import { protectedProcedure, publicProcedure, router } from 'trpc'
import { z } from 'zod'

export const manageBookRouter = router({
  delete: publicProcedure
    .input(bookQueryScheme)
    .mutation(async({ ctx, input }) => {
      const foundBook = await ctx.apiClient.findOneBook(input)
      if (!foundBook) throw new Error("Book Not found")
      return true;
    }),
  create: publicProcedure
    .input(createBookScheme)
    .mutation(({ ctx, input }) => {
      return ctx.apiClient.createBook(input)
    }),
    update: publicProcedure.input(z.object({
      bookId: bookQueryScheme,
      book: createBookScheme,
    }))
      .mutation(({ ctx, input }): Promise<Result<void, Error>> => {
        return ctx.apiClient.updateBook(input.bookId, input.book)
      }),
})

