import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CardImageProvider } from "@/providers/CardImageProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CartDrawer } from "@/components/cart/CartDrawer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";
import ManageInventory from "./pages/ManageInventory";
import CardPage from "./pages/CardPage";
import AddCard from "./pages/AddCard";
import VerifyStorefront from "./pages/VerifyStorefront";
import BulkImport from "./pages/BulkImport";
import NotFound from "./pages/NotFound";
import OrderConfirmPage from "./pages/OrderConfirmPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOffers from "./pages/MyOffers"
import ProfilePage from "./pages/ProfilePage"
import DashboardLayout from "./pages/dashboard/DashboardLayout"
import DashboardOverview from "./pages/dashboard/DashboardOverview"
import DashboardProducts from "./pages/dashboard/DashboardProducts"
import DashboardProductEdit from "./pages/dashboard/DashboardProductEdit"
import DashboardOrders from "./pages/dashboard/DashboardOrders"
import DashboardOffers from "./pages/dashboard/DashboardOffers"
import DashboardSettings from "./pages/dashboard/DashboardSettings"
import StorefrontDirectory from "./pages/StorefrontDirectory"
import StorefrontPage from "./pages/StorefrontPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <CardImageProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartDrawer />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/homepage" replace />} />
              <Route path="/homepage" element={<Marketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/templates/:templateId" element={<CardPage />} />
              <Route path="/storefronts" element={<StorefrontDirectory />} />
              <Route path="/store/:slug" element={<StorefrontPage />} />

              {/* Protected — requires login */}
              <Route path="/inventory" element={<ProtectedRoute><ManageInventory /></ProtectedRoute>} />
              <Route path="/submit" element={<ProtectedRoute><AddCard /></ProtectedRoute>} />
              <Route path="/verify" element={<ProtectedRoute><VerifyStorefront /></ProtectedRoute>} />
              <Route path="/import" element={<ProtectedRoute><BulkImport /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {/* Vendor Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="products" element={<DashboardProducts />} />
                <Route path="products/:id" element={<DashboardProductEdit />} />
                <Route path="orders" element={<DashboardOrders />} />
                <Route path="offers" element={<DashboardOffers />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>

              {/* Legacy route redirect */}
              <Route path="/storefront/manage" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
              </Route>
              <Route path="/account/offers" element={<ProtectedRoute><MyOffers /></ProtectedRoute>} />
              <Route path="/orders/:orderId/confirm" element={<ProtectedRoute><OrderConfirmPage /></ProtectedRoute>} />
              <Route path="/orders/:orderId/success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </CardImageProvider>
);

export default App;
