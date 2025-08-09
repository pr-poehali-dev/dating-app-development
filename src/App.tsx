
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import HomeWeb from "./pages/web/HomeWeb";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import DiscoverWeb from "./pages/web/DiscoverWeb";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import ProfileWeb from "./pages/web/ProfileWeb";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import WebLayout from "./components/layouts/WebLayout";
import TouchLayout from "./components/layouts/TouchLayout";
import { useDevice } from "./hooks/useDevice";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AppContent = () => {
  const { user } = useAuth();
  const { isTouch } = useDevice();

  const Layout = isTouch ? TouchLayout : WebLayout;
  const HomeComponent = isTouch ? Home : HomeWeb;
  const ProfileComponent = isTouch ? Profile : ProfileWeb;
  const DiscoverComponent = isTouch ? Discover : DiscoverWeb;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/discover" /> : <HomeComponent />} />
        <Route path="/auth" element={user ? <Navigate to="/discover" /> : <Auth />} />
        <Route path="/discover" element={<ProtectedRoute><DiscoverComponent /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/chat/:id?" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileComponent /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;