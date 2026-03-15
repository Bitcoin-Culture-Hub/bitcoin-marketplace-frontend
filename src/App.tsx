import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Marketplace from "./pages/Marketplace";
import ManageInventory from "./pages/ManageInventory";
import CardPage from "./pages/CardPage";
import AddCard from "./pages/AddCard";
import VerifyStorefront from "./pages/VerifyStorefront";
import BulkImport from "./pages/BulkImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/homepage" replace />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/templates/:templateId" element={<CardPage />} />

            {/* Protected — requires login */}
            <Route path="/inventory" element={<ProtectedRoute><ManageInventory /></ProtectedRoute>} />
            <Route path="/submit" element={<ProtectedRoute><AddCard /></ProtectedRoute>} />
            <Route path="/verify" element={<ProtectedRoute><VerifyStorefront /></ProtectedRoute>} />
            <Route path="/import" element={<ProtectedRoute><BulkImport /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
