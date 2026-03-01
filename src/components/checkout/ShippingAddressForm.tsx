import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface ShippingAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface ShippingAddressFormProps {
  savedAddresses: ShippingAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddNew: (address: Omit<ShippingAddress, "id">) => void;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const ShippingAddressForm = ({
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onAddNew,
}: ShippingAddressFormProps) => {
  const [showNewForm, setShowNewForm] = useState(savedAddresses.length === 0);
  const [formData, setFormData] = useState<Omit<ShippingAddress, "id">>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const updateField = (field: keyof Omit<ShippingAddress, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.state) newErrors.state = "Required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    if (validate()) {
      onAddNew(formData);
      setShowNewForm(false);
    }
  };

  if (showNewForm || savedAddresses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
            Shipping Address
          </h3>
          {savedAddresses.length > 0 && (
            <button
              onClick={() => setShowNewForm(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Use saved address
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs">
              Full name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={errors.fullName ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine1" className="text-xs">
              Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              className={errors.addressLine1 ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressLine2" className="text-xs text-muted-foreground">
              Address line 2
            </Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={(e) => updateField("addressLine2", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-3 space-y-1.5">
              <Label className="text-xs">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
            </div>
            <div className="col-span-1 space-y-1.5">
              <Label className="text-xs">
                State <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.state} onValueChange={(v) => updateField("state", v)}>
                <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">
                ZIP <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formData.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className={errors.postalCode ? "border-destructive" : ""}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Phone (for carrier updates only)
            </Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <Button onClick={handleAddNew} className="w-full" variant="secondary">
            Use this address
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
          Shipping Address
        </h3>
        <button
          onClick={() => setShowNewForm(true)}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          Add new address
        </button>
      </div>

      <RadioGroup value={selectedAddressId || ""} onValueChange={onSelectAddress}>
        {savedAddresses.map((addr) => (
          <label
            key={addr.id}
            className="flex items-start gap-3 p-3 border border-border bg-card/30 cursor-pointer hover:border-muted-foreground/50 transition-colors"
          >
            <RadioGroupItem value={addr.id} className="mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-muted-foreground">
                {addr.addressLine1}
                {addr.addressLine2 && `, ${addr.addressLine2}`}
              </p>
              <p className="text-muted-foreground">
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ShippingAddressForm;
