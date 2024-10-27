import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const muzakkiCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.muzakkiCategory.findMany();
    return {
      data: categories,
    };
  }),
});
