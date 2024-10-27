"use client";

import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { z } from "zod";
import dayjs from "dayjs";

export const MuzakkiSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  address: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TMuzakki = z.infer<typeof MuzakkiSchema>;

export const columns: ColumnDef<TMuzakki>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Nomor Telepon",
  },
  {
    accessorKey: "address",
    header: "Alamat",
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Dibuat</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = dayjs(date).format("DD MMM YYYY HH:mm:ss");

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <div>Diperbarui</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const formatted = dayjs(date).format("DD MMM YYYY HH:mm:ss");

      return <div>{formatted}</div>;
    },
  },
];
