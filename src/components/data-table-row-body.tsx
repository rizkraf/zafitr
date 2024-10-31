import { type Row } from "@tanstack/react-table";

import { cn } from "~/lib/utils";

interface DataTableRowBodyProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
  value: string;
  isFormatedAmount?: boolean;
}

export function DataTableRowBody<TData>({
  row,
  className,
  value,
  isFormatedAmount,
}: DataTableRowBodyProps<TData>) {
  const amount = parseFloat(row.getValue(value));
  const result = isFormatedAmount
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
    : String(row.getValue(value));

  return (
    <div className={cn(className)}>
      <p className="leading-7 [&:not(:first-child)]:mt-6">{result ?? "-"}</p>
    </div>
  );
}
