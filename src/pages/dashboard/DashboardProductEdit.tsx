import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, DollarSign, MessageSquare } from "lucide-react";
import { useInventory, useUpdateVariantMeta } from "@/hooks/medusa/useInventory";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge, { listingStateVariants } from "@/components/dashboard/StatusBadge";

const DashboardProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: templates, isLoading } = useInventory();
  const updateMeta = useUpdateVariantMeta();
  const { toast } = useToast();
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState("");

  const product = useMemo(() => {
    return templates?.find((t) => t.id === id) ?? null;
  }, [templates, id]);

  const handleToggleListed = async (variantId: string, isListed: boolean) => {
    try {
      await updateMeta.mutateAsync({
        variantId,
        metadata: isListed
          ? { state: "in_collection", listed: false, is_public: false }
          : { state: "listed", listed: true, is_public: true },
      });
      toast({ title: isListed ? "Unlisted" : "Listed", description: "Variant updated." });
    } catch {
      toast({ title: "Error", description: "Failed to update variant.", variant: "destructive" });
    }
  };

  const handleToggleOffers = async (variantId: string, currentlyAccepts: boolean) => {
    try {
      await updateMeta.mutateAsync({
        variantId,
        metadata: { accepts_offers: !currentlyAccepts },
      });
      toast({ title: "Updated", description: `Offers ${currentlyAccepts ? "disabled" : "enabled"}.` });
    } catch {
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    }
  };

  const handleSavePrice = async (variantId: string) => {
    const price = parseFloat(priceValue);
    if (isNaN(price) || price < 0) {
      toast({ title: "Invalid price", variant: "destructive" });
      return;
    }
    try {
      await updateMeta.mutateAsync({
        variantId,
        metadata: { price_btc: price },
      });
      toast({ title: "Price updated" });
      setEditingPrice(null);
      setPriceValue("");
    } catch {
      toast({ title: "Error", description: "Failed to update price.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-64 bg-muted animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Link to="/dashboard/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <PageHeader
        title={product.name}
        description={`${product.series} · ${product.year} · ${product.copies.length} cop${product.copies.length !== 1 ? "ies" : "y"}`}
      />

      {/* Variants Table */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-3">
          Variants ({product.copies.length})
        </p>
        <div className="border border-border rounded-none">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium">Grade</TableHead>
                <TableHead className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium">Cert #</TableHead>
                <TableHead className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium">Price (BTC)</TableHead>
                <TableHead className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium">State</TableHead>
                <TableHead className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium">Offers</TableHead>
                <TableHead className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.copies.map((copy: any) => {
                const isEditing = editingPrice === copy.id;
                const isListed = copy.state === "listed";
                const isSold = copy.state === "sold";
                const isEscrow = copy.state === "in_escrow";

                return (
                  <TableRow key={copy.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-sm">
                      <span className="font-medium">{copy.gradingCompany}</span>{" "}
                      <span className="font-mono">{copy.grade}</span>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {copy.certNumber}
                    </TableCell>
                    <TableCell className="text-sm">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            placeholder="0.00"
                            className="h-7 w-24 rounded-none text-xs font-mono"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleSavePrice(copy.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingPrice(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingPrice(copy.id); setPriceValue(String(copy.priceBTC ?? "")); }}
                          className="font-mono text-xs hover:underline"
                          disabled={isSold || isEscrow}
                        >
                          {copy.priceBTC != null ? `${copy.priceBTC} BTC` : "Set price"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={copy.state} variants={listingStateVariants} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {copy.acceptsOffers ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isSold && !isEscrow && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleToggleListed(copy.id, isListed)}
                              title={isListed ? "Unlist" : "List"}
                            >
                              {isListed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleToggleOffers(copy.id, copy.acceptsOffers)}
                              title={copy.acceptsOffers ? "Disable offers" : "Enable offers"}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductEdit;
