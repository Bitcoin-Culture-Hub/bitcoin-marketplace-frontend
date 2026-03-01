import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  useAsReturn: boolean;
}

interface AddressStepProps {
  initialData: AddressData;
  onContinue: (data: AddressData) => void;
  onBack: () => void;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const AddressStep = ({ initialData, onContinue, onBack }: AddressStepProps) => {
  const [formData, setFormData] = useState<AddressData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});

  const updateField = (field: keyof AddressData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.state) newErrors.state = "Required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Required";
    if (!formData.country) newErrors.country = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-display font-medium">Shipping & return address</h2>
        <p className="text-sm text-muted-foreground">
          Used for buyer shipping labels and returns if needed.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs">
            Full name / Business name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="John Smith"
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="space-y-1.5">
          <Label htmlFor="addressLine1" className="text-xs">
            Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => updateField("addressLine1", e.target.value)}
            placeholder="123 Main Street"
            className={errors.addressLine1 ? "border-destructive" : ""}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-destructive">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-1.5">
          <Label htmlFor="addressLine2" className="text-xs text-muted-foreground">
            Address line 2 (optional)
          </Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) => updateField("addressLine2", e.target.value)}
            placeholder="Apt 4B"
          />
        </div>

        {/* City / State / Postal */}
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-3 space-y-1.5">
            <Label htmlFor="city" className="text-xs">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="New York"
              className={errors.city ? "border-destructive" : ""}
            />
          </div>
          <div className="col-span-1 space-y-1.5">
            <Label className="text-xs">
              State <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.state}
              onValueChange={(v) => updateField("state", v)}
            >
              <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="postalCode" className="text-xs">
              ZIP <span className="text-destructive">*</span>
            </Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              placeholder="10001"
              className={errors.postalCode ? "border-destructive" : ""}
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <Label className="text-xs">
            Country <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.country}
            onValueChange={(v) => updateField("country", v)}
          >
            <SelectTrigger className={errors.country ? "border-destructive" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs text-muted-foreground">
            Phone (optional, for carriers only)
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Use as return address */}
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="useAsReturn"
            checked={formData.useAsReturn}
            onCheckedChange={(checked) => updateField("useAsReturn", !!checked)}
          />
          <Label htmlFor="useAsReturn" className="text-sm text-muted-foreground cursor-pointer">
            Use this as my return address
          </Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AddressStep;
