import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardRelationship } from "./RelationshipSelector";

const gradingCompanies = ["PSA", "BGS", "TAG", "SGC"];
const grades = ["10", "9.5", "9", "8.5", "8", "7", "6", "5", "4", "3", "2", "1"];

interface SelectedCard {
  id: string;
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  thumbnail: string;
}

interface GradingFormProps {
  selectedCard: SelectedCard;
  onBack: () => void;
  onSubmit: (data: GradingData) => void;
  isSubmitting: boolean;
  relationship?: CardRelationship;
  hideCardDisplay?: boolean;
}

interface GradingData {
  gradingCompany: string;
  grade: string;
  certNumber: string;
  frontImage: string | null;
  backImage: string | null;
  notes: string;
}

const GradingForm = ({ 
  selectedCard, 
  onBack, 
  onSubmit, 
  isSubmitting, 
  relationship = "owned",
  hideCardDisplay = false 
}: GradingFormProps) => {
  const [formData, setFormData] = useState<GradingData>({
    gradingCompany: "",
    grade: "",
    certNumber: "",
    frontImage: null,
    backImage: null,
    notes: "",
  });

  const [showOptional, setShowOptional] = useState(false);

  const handleImageUpload = (field: "frontImage" | "backImage") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field: "frontImage" | "backImage") => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.gradingCompany && formData.grade && formData.certNumber;

  // Different labels and CTAs based on relationship
  const sectionTitle = relationship === "preparing" ? "Grading Details" : "Your Graded Copy";
  const optionalLabel = relationship === "preparing" 
    ? "+ Add images & price (optional now)" 
    : "+ Add images & notes (optional)";
  const submitLabel = relationship === "preparing" ? "Save as Prepared" : "Add to My Collection";
  const submitNote = relationship === "preparing" 
    ? "This card will remain private until you explicitly publish it with images and pricing."
    : "Saved as private. Listing publicly is a separate step and always requires images and pricing.";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Selected Card Display - only show if not hidden */}
      {!hideCardDisplay && (
        <div className="border border-border p-4 flex items-center gap-4">
          <div className="w-16 h-20 bg-muted border border-border flex-shrink-0">
            <img
              src={selectedCard.thumbnail}
              alt={selectedCard.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{selectedCard.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedCard.series} · {selectedCard.year} · {selectedCard.cardNumber}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            Change
          </Button>
        </div>
      )}

      {/* Grading Details - Required */}
      <div className="space-y-6">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Grading Company
            </label>
            <Select
              value={formData.gradingCompany}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gradingCompany: value }))}
            >
              <SelectTrigger className="bg-card border-border h-11">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {gradingCompanies.map((company) => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Grade
            </label>
            <Select
              value={formData.grade}
              onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
            >
              <SelectTrigger className="bg-card border-border h-11">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Certification Number
          </label>
          <Input
            value={formData.certNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, certNumber: e.target.value }))}
            className="bg-card border-border h-11 font-mono"
            placeholder="e.g. 12345678"
            required
          />
        </div>
      </div>

      {/* Optional Fields */}
      <div className="border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showOptional ? "− Hide optional fields" : optionalLabel}
        </button>

        {showOptional && (
          <div className="mt-6 space-y-6">
            {/* Images Notice */}
            <p className="text-xs text-muted-foreground">
              Images can be added later before listing.
            </p>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                  Front Image
                </label>
                {formData.frontImage ? (
                  <div className="relative aspect-[3/4] bg-muted border border-border">
                    <img src={formData.frontImage} alt="Front" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage("frontImage")}
                      className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-[3/4] bg-card border border-dashed border-border hover:border-muted-foreground cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload("frontImage")}
                    />
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                  </label>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                  Back Image
                </label>
                {formData.backImage ? (
                  <div className="relative aspect-[3/4] bg-muted border border-border">
                    <img src={formData.backImage} alt="Back" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage("backImage")}
                      className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-[3/4] bg-card border border-dashed border-border hover:border-muted-foreground cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload("backImage")}
                    />
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Private Notes */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                Private Notes
              </label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-card border-border h-11"
                placeholder="Only visible to you"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full h-11 bg-foreground hover:bg-foreground/90 text-background font-display font-medium uppercase tracking-wider"
      >
        {isSubmitting ? "..." : submitLabel}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        {submitNote}
      </p>
    </form>
  );
};

export default GradingForm;
