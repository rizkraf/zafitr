"use client";

import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { z } from "zod";
import dayjs from "dayjs";
import { DataTableColumnHeader } from "../../components/data-table-column-header";
import { DataTableRowBody } from "~/components/data-table-row-body";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import Link from "next/link";

export const MuzakkiSchema = z.object({
  id: z.string(),
  name: z.string(),
  muzakkiCategory: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  address: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TMuzakki = z.infer<typeof MuzakkiSchema>;

export const columns: ColumnDef<TMuzakki>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => (
      <Button variant="link" className="px-0" asChild>
        <Link href={`/muzakki/${row.original.id}`}>{row.getValue("name")}</Link>
      </Button>
    ),
  },
  {
    accessorFn: (data) => data.muzakkiCategory.name,
    id: "muzakkiCategory.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <DataTableRowBody row={row} value="email" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Telepon" />
    ),
    cell: ({ row }) => <DataTableRowBody row={row} value="phone" />,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alamat" />
    ),
    cell: ({ row }) => <DataTableRowBody row={row} value="address" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = dayjs(date).format("DD MMM YYYY HH:mm:ss");

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diperbarui" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const formatted = dayjs(date).format("DD MMM YYYY HH:mm:ss");

      return <div>{formatted}</div>;
    },
  },
];
