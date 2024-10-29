import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const mustahikRouter = createTRPCRouter({
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
      const list = await ctx.db.mustahik.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              address: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              phone: {
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
        select: {
          id: true,
          name: true,
          mustahikCategory: true,
          email: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        data: list,
        meta: {
          total: await ctx.db.mustahik.count(),
          currentPage: (input.pagination?.pageIndex ?? 1) + 1, // Added +1 here
          totalPage: Math.ceil(
            (await ctx.db.mustahik.count()) / (input.pagination?.pageSize ?? 10),
          ),
        },
      };
    }),
  getDetail: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const detail = await ctx.db.mustahik.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          name: true,
          mustahikCategory: true,
          email: true,
          address: true,
          phone: true,
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
        name: z.string().min(1),
        mustahikCategoryId: z.string().min(1),
        email: z.union([
          z.string().email({
            message: "Email tidak valid",
          }),
          z.literal(""),
        ]),
        phone: z.string(),
        address: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.mustahik.create({
        data: {
          name: input.name,
          mustahikCategoryId: input.mustahikCategoryId,
          email: input.email || null,
          phone: input.phone || null,
          address: input.address,
        },
        select: {
          id: true,
          name: true,
          mustahikCategory: true,
          email: true,
          address: true,
          phone: true,
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
        name: z.string().min(1),
        mustahikCategoryId: z.string().min(1),
        email: z.union([
          z.string().email({
            message: "Email tidak valid",
          }),
          z.literal(""),
        ]),
        phone: z.string(),
        address: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.mustahik.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          mustahikCategoryId: input.mustahikCategoryId,
          email: input.email || null,
          phone: input.phone || null,
          address: input.address,
        },
        select: {
          id: true,
          name: true,
          mustahikCategory: true,
          email: true,
          address: true,
          phone: true,
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
      await ctx.db.mustahik.deleteMany({
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
