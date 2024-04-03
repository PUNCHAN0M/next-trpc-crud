import { router, publicProcedure } from 'trpc'
import { z } from 'zod'

export const manageTagRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.apiClient.createTag(input)
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.apiClient.deleteTag(input)
    }),
})
