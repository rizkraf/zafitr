import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
        }
      });
      return {
        data: user,
      };
    }),
  updateCurrentUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return {
        data: updated,
      };
    }),
});
