import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useInventory } from "@/hooks/medusa/useInventory";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableColumn } from "@/components/dashboard/DataTable";
import StatusBadge, { listingStateVariants } from "@/components/dashboard/StatusBadge";

interface ProductRow {
  id: string;
  name: string;
  series: string;
  year: string;
  totalCopies: number;
  listedCount: number;
  soldCount: number;
  topGrade: string;
}

const columns: DataTableColumn<ProductRow>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: (row) => (
      <div>
        <p className="font-medium text-foreground">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.series}</p>
      </div>
    ),
  },
  { header: "Year", accessorKey: "year", className: "w-20" },
  {
    header: "Copies",
    accessorKey: "totalCopies",
    className: "w-20",
    cell: (row) => <span className="font-mono text-xs">{row.totalCopies}</span>,
  },
  {
    header: "Listed",
    accessorKey: "listedCount",
    className: "w-20",
    cell: (row) =>
      row.listedCount > 0 ? (
        <StatusBadge status="listed" variants={listingStateVariants} />
      ) : (
        <span className="text-xs text-muted-foreground">{row.listedCount}</span>
      ),
  },
  {
    header: "Sold",
    accessorKey: "soldCount",
    className: "w-20",
    cell: (row) =>
      row.soldCount > 0 ? (
        <StatusBadge status="sold" variants={listingStateVariants} />
      ) : (
        <span className="text-xs text-muted-foreground">0</span>
      ),
  },
  { header: "Top Grade", accessorKey: "topGrade", className: "w-24" },
];

const DashboardProducts = () => {
  const { data: templates, isLoading } = useInventory();
  const navigate = useNavigate();

  const rows = useMemo<ProductRow[]>(() => {
    if (!templates) return [];
    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      series: t.series,
      year: t.year,
      totalCopies: t.copies.length,
      listedCount: t.copies.filter((c: any) => c.state === "listed").length,
      soldCount: t.copies.filter((c: any) => c.state === "sold").length,
      topGrade: t.copies.length > 0
        ? t.copies.reduce((best: any, c: any) => {
            const g = parseFloat(c.grade) || 0;
            const b = parseFloat(best.grade) || 0;
            return g > b ? c : best;
          }, t.copies[0]).grade
        : "—",
    }));
  }, [templates]);

  return (
    <div className="space-y-0">
      <PageHeader
        title="Products"
        description={`${rows.length} product${rows.length !== 1 ? "s" : ""} in your store`}
        action={{ label: "Add Card", href: "/submit", icon: Plus }}
      />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search products..."
        searchKey="name"
        onRowClick={(row) => navigate(`/dashboard/products/${row.id}`)}
        emptyMessage="No products yet. Add your first card to get started."
      />
    </div>
  );
};

export default DashboardProducts;
