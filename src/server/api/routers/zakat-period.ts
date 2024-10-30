import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const zakatPeriodRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const periods = await ctx.db.zakatPeriod.findMany();
    return {
      data: periods,
    };
  }),
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
      const list = await ctx.db.zakatPeriod.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.search,
                mode: "insensitive",
              },
            },
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
      });
      return {
        data: list,
        meta: {
          total: await ctx.db.mustahikCategory.count(),
          currentPage: (input.pagination?.pageIndex ?? 1) + 1, // Added +1 here
          totalPage: Math.ceil(
            (await ctx.db.mustahikCategory.count()) /
              (input.pagination?.pageSize ?? 10),
          ),
        },
      };
    }),
  getDetail: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const detail = await ctx.db.zakatPeriod.findUnique({
        where: {
          id: input,
        },
      });
      return {
        data: detail,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.zakatPeriod.create({
        data: {
          name: input.name,
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
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.zakatPeriod.update({
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
  deleteMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      // Check if any of the categories have associated muzakki data
      const periodsWithRecord = await ctx.db.zakatRecord.findMany({
        where: {
          zakatPeriod: {
            in: input,
          },
        },
      });

      if (periodsWithRecord.length > 0) {
        throw new Error(
          "Kesalahan: Data tidak bisa dihapus karena masih ada data penerimaan zakat yang terkait",
        );
      }

      await ctx.db.zakatPeriod.deleteMany({
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
