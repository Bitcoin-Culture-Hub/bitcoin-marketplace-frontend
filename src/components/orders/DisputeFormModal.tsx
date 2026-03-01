import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Upload, X, Image as ImageIcon } from "lucide-react";

interface DisputeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { reason: string; description: string; evidenceFiles: File[] }) => Promise<void>;
}

const disputeReasons = [
  { value: "not_received", label: "Item not received" },
  { value: "not_as_described", label: "Item not as described" },
  { value: "damaged", label: "Damaged in transit" },
  { value: "wrong_item", label: "Wrong item" },
  { value: "counterfeit", label: "Suspected counterfeit / slab issue" },
  { value: "other", label: "Other" },
];

const DisputeFormModal = ({ open, onOpenChange, onSubmit }: DisputeFormModalProps) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [understood, setUnderstood] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = 
    reason && 
    description.trim().length >= 20 && 
    understood;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    setEvidenceFiles(prev => [...prev, ...imageFiles].slice(0, 5)); // Max 5 files
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    setEvidenceFiles(prev => [...prev, ...imageFiles].slice(0, 5));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ reason, description: description.trim(), evidenceFiles });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setReason("");
    setDescription("");
    setEvidenceFiles([]);
    setUnderstood(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            File a Dispute
          </DialogTitle>
          <DialogDescription>
            Filing a dispute freezes escrow and pauses payout while the issue is reviewed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Step 1: Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {disputeReasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened and what you want resolved..."
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Be specific about the issue and desired resolution.</span>
              <span className={description.trim().length < 20 ? "text-destructive" : "text-emerald-600"}>
                {description.trim().length}/20 min
              </span>
            </div>
          </div>

          {/* Step 3: Evidence Upload */}
          <div className="space-y-2">
            <Label>Evidence (recommended)</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop images or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Package photos, slab images, damage evidence (max 5)
              </p>
            </div>

            {/* File Previews */}
            {evidenceFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {evidenceFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 4: Confirmation */}
          <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
            <Checkbox
              id="understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked === true)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="understood" className="text-sm font-medium cursor-pointer">
                I understand escrow will be frozen while this dispute is reviewed
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                This creates a formal record for resolution. False disputes may result in account action.
              </p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              Filing a dispute freezes escrow immediately and pauses seller payout.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit} 
            disabled={!isValid || isSubmitting}
            className="w-full sm:w-auto gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeFormModal;
