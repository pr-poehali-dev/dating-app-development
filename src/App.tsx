
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FriendsProvider } from "@/contexts/FriendsContext";
import { StoriesProvider } from "@/contexts/StoriesContext";
import Home from "./pages/Home";
import HomeWeb from "./pages/web/HomeWeb";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import DiscoverWeb from "./pages/web/DiscoverWeb";
import Matches from "./pages/Matches";
import MatchesWeb from "./pages/web/MatchesWeb";
import Chat from "./pages/Chat";
import ChatWeb from "./pages/web/ChatWeb";
import Profile from "./pages/Profile";
import ProfileWeb from "./pages/web/ProfileWeb";
import People from "./pages/People";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Stories from "./pages/Stories";

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
  const MatchesComponent = isTouch ? Matches : MatchesWeb;
  const ChatComponent = isTouch ? Chat : ChatWeb;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/discover" /> : <LandingPage />} />
      <Route path="/auth" element={user ? <Navigate to="/discover" /> : <Auth />} />
      <Route path="/discover" element={<Layout><ProtectedRoute><DiscoverComponent /></ProtectedRoute></Layout>} />
      <Route path="/people" element={<Layout><ProtectedRoute><People /></ProtectedRoute></Layout>} />
      <Route path="/matches" element={<Layout><ProtectedRoute><MatchesComponent /></ProtectedRoute></Layout>} />
      <Route path="/chat/:id?" element={<Layout><ProtectedRoute><ChatComponent /></ProtectedRoute></Layout>} />
      <Route path="/profile" element={<Layout><ProtectedRoute><ProfileComponent /></ProtectedRoute></Layout>} />
      <Route path="/user/:id" element={<Layout><ProtectedRoute><UserProfile /></ProtectedRoute></Layout>} />
      <Route path="/stories" element={<Layout><ProtectedRoute><Stories /></ProtectedRoute></Layout>} />
      <Route path="/notifications" element={<Layout><ProtectedRoute><Notifications /></ProtectedRoute></Layout>} />
      <Route path="/settings" element={<Layout><ProtectedRoute><Settings /></ProtectedRoute></Layout>} />
      <Route path="/admin" element={<Layout><ProtectedRoute><Admin /></ProtectedRoute></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <FriendsProvider>
            <StoriesProvider>
              <AppContent />
            </StoriesProvider>
          </FriendsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;