import { useSellerOrders } from "@/hooks/medusa/useSellerOrders";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableColumn } from "@/components/dashboard/DataTable";
import StatusBadge, { orderStatusVariants } from "@/components/dashboard/StatusBadge";
import type { SellerOrderRow } from "@/services/store.api";

const columns: DataTableColumn<SellerOrderRow>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    className: "w-40",
    cell: (row) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.id.slice(0, 12)}...
      </span>
    ),
  },
  {
    header: "Card",
    accessorKey: "card_id",
    cell: (row) => (
      <span className="font-mono text-xs">{row.card_id.slice(0, 12)}...</span>
    ),
  },
  {
    header: "Buyer",
    accessorKey: "buyer_id",
    cell: (row) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.buyer_id.slice(0, 12)}...
      </span>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    className: "w-28",
    cell: (row) => (
      <span className="font-mono text-sm">
        {row.amount} {row.currency}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    className: "w-24",
    cell: (row) => (
      <StatusBadge status={row.status} variants={orderStatusVariants} />
    ),
  },
  {
    header: "Date",
    accessorKey: "created_at",
    className: "w-32",
    cell: (row) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.created_at).toLocaleDateString()}
      </span>
    ),
  },
];

const DashboardOrders = () => {
  const { data: orders, isLoading } = useSellerOrders();

  return (
    <div className="space-y-0">
      <PageHeader
        title="Orders"
        description="Marketplace orders for your cards"
      />
      <DataTable
        columns={columns}
        data={orders ?? []}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search orders..."
        emptyMessage="No orders yet."
      />
    </div>
  );
};

export default DashboardOrders;
