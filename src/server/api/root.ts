import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { muzakkiRouter } from "~/server/api/routers/muzakki";
import { muzakkiCategoryRouter } from "./routers/muzakki-category";
import { mustahikRouter } from "./routers/mustahik";
import { mustahikCategoryRouter } from "./routers/mustahik-category";
import { zakatPeriodRouter } from "./routers/zakat-period";
import { zakatRecordRouter } from "./routers/zakat-record";
import { zakatDistributionRouter } from "./routers/zakat-distribution";
import { statisticRouter } from "./routers/statistic";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  muzakki: muzakkiRouter,
  muzakkiCategory: muzakkiCategoryRouter,
  mustahik: mustahikRouter,
  mustahikCategory: mustahikCategoryRouter,
  zakatPeriod: zakatPeriodRouter,
  zakatRecord: zakatRecordRouter,
  zakatDistribution: zakatDistributionRouter,
  statistic: statisticRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
