import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";

import Marketplace from "./pages/Marketplace";
import ManageInventory from "./pages/ManageInventory";
import CardPage from "./pages/CardPage";
import AddCard from "./pages/AddCard";
import VerifyStorefront from "./pages/VerifyStorefront";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          
          
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/templates/:templateId" element={<CardPage />} />
          <Route path="/inventory" element={<ManageInventory />} />
          
          {/* Collection Management */}
          <Route path="/submit" element={<AddCard />} />
          
          
          
          {/* Verification */}
          <Route path="/verify" element={<VerifyStorefront />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
