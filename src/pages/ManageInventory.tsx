import Header from "@/components/layout/Header";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardProducts from "@/pages/dashboard/DashboardProducts";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const ManageInventory = () => {
  const { customer } = useAuth();

  const vendorName =
    (customer?.metadata?.storefront_name as string) ??
    customer?.first_name ??
    "My Store";

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="light" />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen>
          <DashboardSidebar
            vendorName={vendorName}
            vendorEmail={customer?.email}
          />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 bg-background min-h-0 overflow-auto">
              <DashboardProducts />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default ManageInventory;
