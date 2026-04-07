import { useEffect, useState } from "react";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/medusa/useVendor";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/dashboard/PageHeader";

const DashboardSettings = () => {
  const { data: vendorData, isLoading } = useVendorProfile();
  const updateMutation = useUpdateVendorProfile();
  const { toast } = useToast();

  const vendor = vendorData?.vendor;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (vendor) {
      setName(vendor.name);
      setSlug(vendor.slug);
      setEmail(vendor.email);
      setPhone(vendor.phone ?? "");
    }
  }, [vendor]);

  const handleSave = async () => {
    if (!vendor) return;
    if (!name.trim() || !slug.trim() || !email.trim()) {
      toast({ title: "Validation Error", description: "Name, slug, and email are required.", variant: "destructive" });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: vendor.id,
        data: {
          name: name.trim(),
          slug: slug.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
        },
      });
      toast({ title: "Settings saved", description: "Your store profile has been updated." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to save.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4 max-w-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your store profile and details."
      />

      <div className="max-w-lg space-y-5">
        <div className="border border-border bg-card p-5 space-y-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
            Store Profile
          </p>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Store Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Store"
              className="rounded-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="my-store"
              className="rounded-none font-mono text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              Your store URL: /store/{slug || "your-slug"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="rounded-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Phone (optional)</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="+1 555-0123"
              className="rounded-none"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full rounded-none font-display uppercase tracking-wider text-xs"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Store Info */}
        {vendor && (
          <div className="border border-border bg-card p-5 space-y-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
              Store Info
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Seller ID</p>
                <p className="font-mono text-foreground">{vendor.seller_id.slice(0, 16)}...</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="text-foreground">{new Date(vendor.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSettings;
