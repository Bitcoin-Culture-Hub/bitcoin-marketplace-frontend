import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut, ExternalLink } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/products": "Products",
  "/dashboard/orders": "Orders",
  "/dashboard/offers": "Offers",
  "/dashboard/settings": "Settings",
  "/inventory": "Products",
};

const DashboardTopbar = () => {
  const location = useLocation();
  const { customer, logout } = useAuth();

  // Build breadcrumb: match longest prefix
  const pathSegments = Object.keys(breadcrumbMap)
    .filter((p) => location.pathname.startsWith(p))
    .sort((a, b) => b.length - a.length);
  const currentLabel = breadcrumbMap[pathSegments[0] ?? "/dashboard"] ?? "Dashboard";

  // Check for product edit page
  const isProductEdit = /^\/dashboard\/products\/.+/.test(location.pathname);

  return (
    <header className="flex items-center h-12 px-4 border-b border-border bg-background shrink-0">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-3 h-5" />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        {currentLabel !== "Overview" && (
          <>
            <span>/</span>
            <Link
              to={pathSegments[0] ?? "/dashboard"}
              className="hover:text-foreground transition-colors"
            >
              {currentLabel}
            </Link>
          </>
        )}
        {isProductEdit && (
          <>
            <span>/</span>
            <span className="text-foreground">Edit</span>
          </>
        )}
      </nav>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors outline-none">
            <UserCircle className="h-5 w-5" />
            <span className="hidden sm:inline">
              {customer?.first_name || customer?.email || "Account"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/marketplace" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Marketplace
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardTopbar;
