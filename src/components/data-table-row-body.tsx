import { type Row } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import { formatedCurrency } from "~/utils/parse";

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
    ? formatedCurrency(amount)
    : String(row.getValue(value) !== null ? row.getValue(value) : "-");

  return (
    <div className={cn(className)}>
      <p className="leading-7 [&:not(:first-child)]:mt-6">{result}</p>
    </div>
  );
}
