import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const zakatUnitRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const periods = await ctx.db.zakatUnit.findMany();
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
      const list = await ctx.db.zakatUnit.findMany({
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
          total: await ctx.db.zakatUnit.count(),
          currentPage: (input.pagination?.pageIndex ?? 1) + 1, // Added +1 here
          totalPage: Math.ceil(
            (await ctx.db.zakatUnit.count()) /
              (input.pagination?.pageSize ?? 10),
          ),
        },
      };
    }),
  getDetail: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const detail = await ctx.db.zakatUnit.findUnique({
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
        type: z.enum(["BERAS", "UANG"]),
        conversionRate: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.zakatUnit.create({
        data: {
          name: input.name,
          type: input.type,
          conversionRate: input.conversionRate,
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
        type: z.enum(["BERAS", "UANG"]),
        conversionRate: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.zakatUnit.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          type: input.type,
          conversionRate: input.conversionRate,
        },
      });
      return {
        data: updated,
      };
    }),
  deleteMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.zakatUnit.deleteMany({
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
