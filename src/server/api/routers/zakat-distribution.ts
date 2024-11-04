import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const zakatDistributionRouter = createTRPCRouter({
  getList: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        pagination: z
          .object({
            pageIndex: z.number().optional(),
            pageSize: z.number().optional(),
          })
          .optional(),
        sorting: z.array(
          z.object({
            id: z.string(),
            desc: z.boolean(),
          }),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const list = await ctx.db.zakatDistribution.findMany({
        where: {
          OR: [
            {
              transactionNumber: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              mustahik: {
                name: {
                  contains: input.search,
                  mode: "insensitive",
                },
              }
            }
          ],
        },
        orderBy: input.sorting.map((sort) => {
          const [relation, field] = sort.id.split(".") as [string, string];
          return field
            ? { [relation]: { [field]: sort.desc ? "desc" : "asc" } }
            : { [sort.id]: sort.desc ? "desc" : "asc" };
        }),
        skip:
          ((input.pagination?.pageIndex ?? 1) - 1 + 1) * // Added +1 here
          (input.pagination?.pageSize ?? 10),
        take: input.pagination?.pageSize ?? 10,
        select: {
          id: true,
          transactionNumber: true,
          zakatRecord: true,
          mustahik: true,
          amount: true,
          dateDistribution: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        data: list,
        meta: {
          total: await ctx.db.zakatDistribution.count(),
          currentPage: (input.pagination?.pageIndex ?? 1) + 1, // Added +1 here
          totalPage: Math.ceil(
            (await ctx.db.zakatDistribution.count()) /
              (input.pagination?.pageSize ?? 10),
          ),
        },
      };
    }),
  getDetail: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const detail = await ctx.db.zakatDistribution.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          transactionNumber: true,
          zakatRecord: true,
          mustahik: true,
          amount: true,
          dateDistribution: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        data: detail,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        mustahikId: z.string(),
        zakatRecordId: z.string(),
        amount: z.number(),
        dateDistribution: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generateTransactionNumber = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");

        return `DST${year}${month}${day}${random}`;
      };

      const transactionNumber = generateTransactionNumber();

      const created = await ctx.db.zakatDistribution.create({
        data: {
          transactionNumber,
          mustahikId: input.mustahikId,
          zakatRecordId: input.zakatRecordId,
          amount: input.amount,
          dateDistribution: input.dateDistribution,
        },
        select: {
          id: true,
          transactionNumber: true,
          mustahik: true,
          amount: true,
          dateDistribution: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        data: created,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        mustahikId: z.string(),
        zakatRecordId: z.string(),
        amount: z.number(),
        dateDistribution: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingZakatRecord = await ctx.db.zakatDistribution.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingZakatRecord) {
        throw new Error("Kesalahan: Distribusi Zakat tidak ditemukan");
      }

      const updated = await ctx.db.zakatDistribution.update({
        where: {
          id: input.id,
        },
        data: {
          mustahikId: input.mustahikId,
          zakatRecordId: input.zakatRecordId,
          amount: input.amount,
          dateDistribution: input.dateDistribution,
        },
        select: {
          id: true,
          transactionNumber: true,
          mustahik: true,
          amount: true,
          dateDistribution: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        data: updated,
      };
    }),
  deleteMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const existingIds = await ctx.db.zakatDistribution.findMany({
        where: {
          id: {
            in: input,
          },
        },
        select: {
          id: true,
        },
      });

      const existingIdSet = new Set(existingIds.map((record) => record.id));
      const nonExistingIds = input.filter((id) => !existingIdSet.has(id));

      if (nonExistingIds.length > 0) {
        throw new Error(
          `Kesalahan: Distribusi Zakat dengan id ${nonExistingIds.join(", ")} tidak ditemukan`,
        );
      }

      await ctx.db.zakatDistribution.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });

      return {
        data: null,
      };
    }),
});
