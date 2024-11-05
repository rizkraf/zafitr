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
  mustahik: z.object({
    name: z.string().nullable(),
  }),
  zakatRecord: z.object({
    id: z.string(),
    transactionNumber: z.string(),
  }),
  period: z.object({
    name: z.string(),
  }),
  amount: z.number(),
  dateDistribution: z.date(),
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
        <Link href={`/distribusi/${row.original.id}`}>
          {row.getValue("transactionNumber")}
        </Link>
      </Button>
    ),
  },
  {
    accessorFn: (data) => data.zakatRecord.transactionNumber,
    id: "zakatRecord.transactionNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="No. Transaksi Penerimaan Zakat"
      />
    ),
    cell: ({ row }) => (
      <Button variant="link" className="px-0" asChild>
        <Link href={`/penerimaan/${row.original.zakatRecord.id}`}>
          {row.getValue("zakatRecord.transactionNumber")}
        </Link>
      </Button>
    ),
  },
  {
    accessorFn: (data) => data.mustahik.name,
    id: "mustahik.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mustahik" />
    ),
  },
  {
    accessorFn: (data) => data.period.name,
    id: "period.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Periode Zakat" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Besaran Penyaluran Zakat" />
    ),
    cell: ({ row }) => (
      <DataTableRowBody row={row} value="amount" isFormatedAmount />
    ),
  },
  {
    accessorKey: "dateDistribution",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Distribusi" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateDistribution"));
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
