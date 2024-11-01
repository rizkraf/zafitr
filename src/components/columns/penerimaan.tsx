"use client";

import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { z } from "zod";
import dayjs from "dayjs";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowBody } from "~/components/data-table-row-body";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import Link from "next/link";

export const MuzakkiSchema = z.object({
  id: z.string(),
  transactionNumber: z.string(),
  user: z.object({
    name: z.string().nullable(),
    username: z.string().nullable(),
    role: z.string(),
  }),
  muzakki: z.object({
    name: z.string(),
  }),
  period: z.object({
    name: z.string(),
  }),
  type: z.string(),
  amount: z.number(),
  dateReceived: z.date(),
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
    accessorKey: "transactionNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. Transaksi" />
    ),
    cell: ({ row }) => (
      <Button variant="link" className="px-0" asChild>
        <Link href={`/penerimaan/${row.original.id}`}>
          {row.getValue("transactionNumber")}
        </Link>
      </Button>
    ),
  },
  {
    accessorFn: (data) => data.user.name,
    id: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Petugas" />
    ),
  },
  {
    accessorFn: (data) => data.muzakki.name,
    id: "muzakki.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Muzakki" />
    ),
  },
  {
    accessorFn: (data) => data.period.name,
    id: "period.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Periode" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipe" />
    ),
    cell: ({ row }) => <DataTableRowBody row={row} value="type" />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Besaran Zakat" />
    ),
    cell: ({ row }) => (
      <DataTableRowBody row={row} value="amount" isFormatedAmount />
    ),
  },
  {
    accessorKey: "dateReceived",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Diterima" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateReceived"));
      const formatted = dayjs(date).format("DD MMM YYYY");

      return <div>{formatted}</div>;
    },
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
