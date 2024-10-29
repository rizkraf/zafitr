import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const mustahikCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.mustahikCategory.findMany();
    return {
      data: categories,
    };
  }),
});
