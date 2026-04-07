import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  listSellerPendingOffers,
  respondToOffer,
} from "@/services/store.api";
import type { SellerPendingOfferRow } from "@/types/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type DataTableColumn } from "@/components/dashboard/DataTable";
import StatusBadge, { offerStatusVariants } from "@/components/dashboard/StatusBadge";

const DashboardOffers = () => {
  const { customer } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [acceptDialog, setAcceptDialog] = useState<{
    offer: SellerPendingOfferRow;
    invoiceUrl?: string | null;
  } | null>(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: ["vendor", "offers"],
    queryFn: async () => {
      const res = await listSellerPendingOffers();
      return res.offers;
    },
    enabled: !!customer,
    staleTime: 15_000,
  });

  const handleAccept = async (offer: SellerPendingOfferRow) => {
    try {
      const res = await respondToOffer(offer.id, "accept");
      queryClient.invalidateQueries({ queryKey: ["vendor", "offers"] });
      queryClient.invalidateQueries({ queryKey: ["vendor", "summary"] });
      const invoiceUrl = "invoice_url" in res ? res.invoice_url : null;
      setAcceptDialog({ offer, invoiceUrl });
      toast({ title: "Offer accepted" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleReject = async (offer: SellerPendingOfferRow) => {
    try {
      await respondToOffer(offer.id, "reject");
      queryClient.invalidateQueries({ queryKey: ["vendor", "offers"] });
      toast({ title: "Offer rejected" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const columns: DataTableColumn<SellerPendingOfferRow>[] = [
    {
      header: "Card",
      accessorKey: "card_listing_title",
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground text-sm">{row.card_listing_title}</p>
          {row.listing_grade_summary && (
            <p className="text-xs text-muted-foreground">{row.listing_grade_summary}</p>
          )}
        </div>
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
        <span className="font-mono text-sm font-medium">${row.amount.toFixed(2)}</span>
      ),
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: (row) => (
        <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
          {row.message || "—"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "w-24",
      cell: (row) => (
        <StatusBadge status={row.status} variants={offerStatusVariants} />
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      className: "w-40 text-right",
      cell: (row) =>
        row.status === "pending" ? (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs rounded-none"
              onClick={(e) => { e.stopPropagation(); handleAccept(row); }}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs rounded-none text-destructive"
              onClick={(e) => { e.stopPropagation(); handleReject(row); }}
            >
              Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-0">
      <PageHeader
        title="Offers"
        description="Incoming offers on your listings"
      />
      <DataTable
        columns={columns}
        data={offers ?? []}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search offers..."
        searchKey="card_listing_title"
        emptyMessage="No offers yet."
      />

      {/* Accept confirmation dialog */}
      <Dialog open={!!acceptDialog} onOpenChange={() => setAcceptDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offer Accepted</DialogTitle>
            <DialogDescription>
              The offer on "{acceptDialog?.offer.card_listing_title}" has been accepted.
              {acceptDialog?.invoiceUrl
                ? " A payment invoice has been created for the buyer."
                : " The buyer will be notified."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setAcceptDialog(null)} className="rounded-none">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardOffers;
