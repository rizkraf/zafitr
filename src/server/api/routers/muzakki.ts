import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const muzakkiRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const list = await ctx.db.muzakki.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return list;
  }),
});
