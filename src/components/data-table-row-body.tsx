/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type Row } from "@tanstack/react-table";

import { cn } from "~/lib/utils";

interface DataTableRowBodyProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
  value: string;
}

export function DataTableRowBody<TData>({
  row,
  className,
  value,
}: DataTableRowBodyProps<TData>) {
  return (
    <div className={cn(className)}>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {row.getValue(value) || "-"}
      </p>
    </div>
  );
}
