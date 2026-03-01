import { Link } from "react-router-dom";
import { Settings, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  storefrontName: string;
  location?: string;
  memberSince?: string;
  isVerified: boolean;
  onVerifyClick?: () => void;
}

const DashboardHeader = ({
  storefrontName,
  location,
  memberSince,
  isVerified,
  onVerifyClick,
}: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border pb-6 mb-6">
      <div className="flex items-start justify-between">
        {/* Left: Identity */}
        <div>
          <h1 className="text-2xl font-display font-medium text-foreground">
            {storefrontName}
          </h1>
        </div>

      </div>

    </header>
  );
};

export default DashboardHeader;
