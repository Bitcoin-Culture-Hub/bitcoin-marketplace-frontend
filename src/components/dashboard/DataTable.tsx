import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface DataTableColumn<T> {
  header: string;
  accessorKey: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKey,
  onRowClick,
  pageSize = 10,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search || !searchable) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      if (searchKey) {
        return String(getNestedValue(row, searchKey) ?? "").toLowerCase().includes(q);
      }
      return columns.some((col) =>
        String(getNestedValue(row, col.accessorKey) ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, search, searchable, searchKey, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, filtered.length);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {searchable && <Skeleton className="h-9 w-64" />}
        <div className="border border-border rounded-none">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                {columns.map((col) => (
                  <TableHead
                    key={col.accessorKey}
                    className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium"
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {searchable && (
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            className="pl-8 h-9 rounded-none text-sm"
          />
        </div>
      )}

      <div className="border border-border rounded-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {columns.map((col) => (
                <TableHead
                  key={col.accessorKey}
                  className={`text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium ${col.className ?? ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground py-12">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((row, i) => (
                <TableRow
                  key={(row as any).id ?? i}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : "hover:bg-muted/50 transition-colors"}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey} className={`text-sm ${col.className ?? ""}`}>
                      {col.cell ? col.cell(row) : String(getNestedValue(row, col.accessorKey) ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            Showing {start}–{end} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
