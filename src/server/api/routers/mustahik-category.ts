import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const mustahikCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.mustahikCategory.findMany();
    return {
      data: categories,
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
      const list = await ctx.db.mustahikCategory.findMany({
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
      const detail = await ctx.db.mustahikCategory.findUnique({
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
      const created = await ctx.db.mustahikCategory.create({
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
      const updated = await ctx.db.mustahikCategory.update({
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
      const categoriesWithMustahik = await ctx.db.mustahik.findMany({
        where: {
          mustahikCategoryId: {
            in: input,
          },
        },
      });

      if (categoriesWithMustahik.length > 0) {
        throw new Error(
          "Kesalahan: Data tidak bisa dihapus karena masih ada data mustahik yang terkait",
        );
      }

      await ctx.db.mustahikCategory.deleteMany({
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
