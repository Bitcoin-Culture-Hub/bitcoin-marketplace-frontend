import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Image as ImageIcon, MessageSquare } from "lucide-react";

interface DisputeData {
  id: string;
  reason: string;
  reasonLabel: string;
  description: string;
  evidenceUrls: string[];
  status: "open" | "under_review" | "resolved";
  createdAt: string;
}

interface DisputeBannerProps {
  dispute: DisputeData;
  onAddEvidence?: () => void;
}

const disputeReasonLabels: Record<string, string> = {
  not_received: "Item not received",
  not_as_described: "Item not as described",
  damaged: "Damaged in transit",
  wrong_item: "Wrong item",
  counterfeit: "Suspected counterfeit / slab issue",
  other: "Other issue",
};

const DisputeBanner = ({ dispute, onAddEvidence }: DisputeBannerProps) => {
  const statusConfig = {
    open: {
      label: "Open",
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    under_review: {
      label: "Under Review",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    resolved: {
      label: "Resolved",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
  };

  const status = statusConfig[dispute.status];

  return (
    <div className="bg-destructive/5 border border-destructive/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-destructive/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="font-semibold text-destructive">Dispute Open — Escrow Frozen</span>
        </div>
        <Badge variant="outline" className={status.className}>
          {status.label}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Reason */}
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reason</span>
          <p className="text-foreground font-medium mt-1">
            {disputeReasonLabels[dispute.reason] || dispute.reasonLabel}
          </p>
        </div>

        {/* Description */}
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</span>
          <p className="text-sm text-foreground mt-1">{dispute.description}</p>
        </div>

        {/* Evidence */}
        {dispute.evidenceUrls.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Evidence</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {dispute.evidenceUrls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-lg overflow-hidden border border-border hover:border-foreground/30 transition-colors"
                >
                  <img
                    src={url}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Filed {dispute.createdAt}
        </div>

        {/* Status Message */}
        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Status: Under review</p>
            <p className="text-xs text-muted-foreground mt-1">
              Support is reviewing your dispute. You'll be notified when there's an update.
            </p>
          </div>
        </div>

        {/* Actions */}
        {onAddEvidence && dispute.status === "open" && (
          <Button variant="outline" size="sm" onClick={onAddEvidence} className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Add More Evidence
          </Button>
        )}
      </div>
    </div>
  );
};

export default DisputeBanner;
