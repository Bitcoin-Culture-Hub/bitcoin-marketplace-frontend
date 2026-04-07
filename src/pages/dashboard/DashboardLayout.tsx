import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useIsVerifiedSeller } from "@/hooks/medusa/useVerification";
import { useVendorProfile } from "@/hooks/medusa/useVendor";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Header from "@/components/layout/Header";

const DashboardLayout = () => {
  const { customer, loading: authLoading } = useAuth();
  const isVerified = useIsVerifiedSeller(customer);
  const { data: vendorData, isLoading: vendorLoading } = useVendorProfile();

  if (authLoading || vendorLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!isVerified) {
    return <Navigate to="/verify" replace />;
  }

  const vendor = vendorData?.vendor;

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="light" />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen>
          <DashboardSidebar
            vendorName={vendor?.name}
            vendorEmail={vendor?.email}
          />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 bg-background min-h-0 overflow-auto">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default DashboardLayout;
