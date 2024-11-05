import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const statisticRouter = createTRPCRouter({
  getRecordAndDistributionStatisticByPeriod: protectedProcedure
    .input(
      z.object({
        periodId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const period = await ctx.db.zakatPeriod.findUnique({
        where: {
          id: input.periodId,
        },
      });

      if (!period) {
        throw new Error("Period not found");
      }

      const records = await ctx.db.zakatRecord.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          zakatPeriod: input.periodId,
        },
      });

      const distribution = await ctx.db.zakatDistribution.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          zakatPeriod: input.periodId,
        },
      });

      const recordAmount = records._sum.amount ?? 0;
      const distributionAmount = distribution._sum.amount ?? 0;

      return [
        { zakat: "Penerimaan", amount: recordAmount, fill: "var(--color-record)" },
        { zakat: "Distribusi", amount: distributionAmount, fill: "var(--color-distribution)" },
      ];
    }),
})
