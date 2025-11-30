import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import LivePlayer from "./pages/LivePlayer";
import VendorProfile from "./pages/VendorProfile";
import VendorDashboard from "./pages/VendorDashboard";
import Menu from "./pages/Menu";
import Discover from "./pages/Discover";
import CategoryDetails from "./pages/CategoryDetails";
import LiveStreamsFeed from "./pages/LiveStreamsFeed";
import Bites from "./pages/Bites";
import StreetExplorer from "./pages/StreetExplorer";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/OrderTracking";
import OrderDetails from "./pages/OrderDetails";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";
import SavedAddresses from "./pages/SavedAddresses";
import PaymentMethods from "./pages/PaymentMethods";
import HelpSupport from "./pages/HelpSupport";
import SupportChat from "./pages/SupportChat";
import UserSignIn from "./pages/UserSignIn";
import UserSignUp from "./pages/UserSignUp";
import VendorSignIn from "./pages/VendorSignIn";
import VendorSignUp from "./pages/VendorSignUp";
import VendorHome from "./pages/VendorHome";
import VendorOrders from "./pages/VendorOrders";
import VendorMenu from "./pages/VendorMenu";
import VendorAnalytics from "./pages/VendorAnalytics";
import VendorLiveStream from "./pages/VendorLiveStream";
import VendorBusinessInfo from "./pages/VendorBusinessInfo";
import VendorProfileSettings from "./pages/VendorProfileSettings";
import VendorNotifications from "./pages/VendorNotifications";
import VendorPreferences from "./pages/VendorPreferences";
import VendorPaymentsPayouts from "./pages/VendorPaymentsPayouts";
import VendorVerification from "./pages/VendorVerification";
import VendorHelpSupport from "./pages/VendorHelpSupport";
import { OrdersProvider } from "./contexts/OrdersContext";
import { SplashScreen } from "./components/SplashScreen";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { StreamMiniPlayer } from "./components/StreamMiniPlayer";
import { ScrollToTop } from "./components/ScrollToTop";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./components/ui/alert-dialog";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on initial load
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    return !hasSeenSplash;
  });
  const [isStreamMinimized, setIsStreamMinimized] = useState(false);
  const [streamData, setStreamData] = useState({ viewerCount: 234, isStreaming: true });
  const [showEndStreamDialog, setShowEndStreamDialog] = useState(false);
  const [isUserStreamMinimized, setIsUserStreamMinimized] = useState(false);
  const [userStreamData, setUserStreamData] = useState<{ streamId?: string; dishName?: string; vendorName?: string; viewers?: number; isPlaying?: boolean; videoSrc?: string; poster?: string; currentTime?: number } | null>(null);

  useEffect(() => {
    // Mark splash as seen
    if (showSplash) {
      sessionStorage.setItem("hasSeenSplash", "true");
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Check authentication after splash completes
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userType = localStorage.getItem("userType");
    
    // If on root path and not authenticated, redirect to sign-in
    if (location.pathname === "/" && !isAuthenticated) {
      navigate("/user/signin");
    }
    // If authenticated and on root, redirect to appropriate home
    else if (location.pathname === "/" && isAuthenticated) {
      if (userType === "vendor") {
        navigate("/vendor/home");
      } else {
        navigate("/home");
      }
    }
  };

  // Check authentication on route changes
  useEffect(() => {
    if (!showSplash) {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const userType = localStorage.getItem("userType");
      const authPaths = ["/user/signin", "/user/signup", "/vendor/signin", "/vendor/signup", "/"];
      
      // If trying to access protected routes without auth, redirect to sign-in
      if (!isAuthenticated && !authPaths.includes(location.pathname)) {
        navigate("/user/signin");
      }
      // If authenticated and on root, redirect to appropriate home
      else if (isAuthenticated && location.pathname === "/") {
        if (userType === "vendor") {
          navigate("/vendor/home");
        } else {
          navigate("/home");
        }
      }
    }
  }, [location.pathname, showSplash, navigate]);

  // Check for minimized vendor stream state
  useEffect(() => {
    const checkStreamState = () => {
      const minimized = localStorage.getItem("vendor-stream-minimized") === "true";
      setIsStreamMinimized(minimized);
      
      // Get stream data from localStorage (set by VendorLiveStream)
      const savedStreamData = localStorage.getItem("vendor-stream-data");
      if (savedStreamData) {
        try {
          const parsed = JSON.parse(savedStreamData);
          setStreamData(parsed);
        } catch {
          // ignore parse errors, set default
          setStreamData({ viewerCount: 234, isStreaming: true });
        }
      } else if (minimized) {
        // If minimized but no data, assume streaming
        setStreamData({ viewerCount: 234, isStreaming: true });
      }
    };

    checkStreamState();
    // Check periodically for updates
    const interval = setInterval(checkStreamState, 500);
    return () => clearInterval(interval);
  }, []);

  // Check for minimized user stream state
  useEffect(() => {
    const checkUserStreamState = () => {
      const minimized = localStorage.getItem("user-stream-minimized") === "true";
      setIsUserStreamMinimized(minimized);
      
      // Get stream data from localStorage (set by LivePlayer)
      const savedStreamData = localStorage.getItem("user-stream-data");
      if (savedStreamData) {
        try {
          const parsed = JSON.parse(savedStreamData);
          setUserStreamData(parsed);
        } catch {
          // ignore parse errors
          setUserStreamData(null);
        }
      } else {
        setUserStreamData(null);
      }
    };

    checkUserStreamState();
    // Check periodically for updates
    const interval = setInterval(checkUserStreamState, 500);
    return () => clearInterval(interval);
  }, []);

  const isVendorRoute = location.pathname.startsWith("/vendor/") || location.pathname === "/vendor/home" || location.pathname === "/vendor/live" || location.pathname === "/vendor/orders" || location.pathname === "/vendor/menu" || location.pathname === "/vendor/analytics" || location.pathname === "/vendor/profile";
  const isUserRoute = !isVendorRoute && !location.pathname.startsWith("/user/sign") && !location.pathname.startsWith("/vendor/sign") && location.pathname !== "/" && location.pathname !== "/onboarding";

  const handleMaximizeStream = () => {
    setIsStreamMinimized(false);
    localStorage.setItem("vendor-stream-minimized", "false");
    // Update stream data before navigating
    const savedStreamData = localStorage.getItem("vendor-stream-data");
    if (savedStreamData) {
      try {
        const parsed = JSON.parse(savedStreamData);
        localStorage.setItem("vendor-stream-data", JSON.stringify({
          ...parsed,
          isStreaming: true,
        }));
      } catch {
        // ignore parse errors
      }
    }
    navigate("/vendor/live");
  };

  const handleMaximizeUserStream = () => {
    setIsUserStreamMinimized(false);
    localStorage.setItem("user-stream-minimized", "false");
    // Update stream data with current time before navigating
    if (userStreamData?.streamId) {
      const savedTime = localStorage.getItem("user-stream-current-time");
      if (savedTime) {
        const updatedData = {
          ...userStreamData,
          currentTime: parseFloat(savedTime),
        };
        localStorage.setItem("user-stream-data", JSON.stringify(updatedData));
      }
      navigate(`/live/${userStreamData.streamId}`);
    }
  };

  const handleCloseUserStream = () => {
    setIsUserStreamMinimized(false);
    localStorage.removeItem("user-stream-minimized");
    localStorage.removeItem("user-stream-data");
  };

  const handleEndStream = () => {
    setShowEndStreamDialog(true);
  };

  const confirmEndStream = () => {
    setIsStreamMinimized(false);
    localStorage.removeItem("vendor-stream-minimized");
    localStorage.removeItem("vendor-stream-data");
    setShowEndStreamDialog(false);
    navigate("/vendor/home");
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <ScrollToTop />
      {/* Show miniplayer on vendor routes when stream is minimized */}
      {isVendorRoute && isStreamMinimized && (
        <StreamMiniPlayer
          viewerCount={streamData.viewerCount || 234}
          isStreaming={streamData.isStreaming !== false}
          onMaximize={handleMaximizeStream}
          onEndStream={handleEndStream}
          isUserStream={false}
          // For vendor, it's a live camera feed, so no videoSrc needed
          // The miniplayer will show the placeholder which is appropriate for live camera
        />
      )}
      {/* Show miniplayer on user routes when stream is minimized */}
      {isUserRoute && isUserStreamMinimized && userStreamData && (
        <StreamMiniPlayer
          viewerCount={userStreamData.viewers || 0}
          isStreaming={userStreamData.isPlaying !== false}
          onMaximize={handleMaximizeUserStream}
          onEndStream={handleCloseUserStream}
          isUserStream={true}
          videoSrc={userStreamData.videoSrc}
          poster={userStreamData.poster}
          isPlaying={userStreamData.isPlaying === true}
          currentTime={userStreamData.currentTime || 0}
        />
      )}

      {/* End Stream Confirmation Dialog */}
      <AlertDialog open={showEndStreamDialog} onOpenChange={setShowEndStreamDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>End Stream</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end the stream? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEndStream}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, End Stream
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/user/signin" element={<UserSignIn />} />
        <Route path="/user/signup" element={<UserSignUp />} />
        <Route path="/vendor/signin" element={<VendorSignIn />} />
        <Route path="/vendor/signup" element={<VendorSignUp />} />
        {/* Protected User Routes */}
        <Route path="/home" element={<ProtectedRoute requiredUserType="user"><Home /></ProtectedRoute>} />
        <Route path="/live/:id" element={<ProtectedRoute><LivePlayer /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute requiredUserType="user"><Menu /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute requiredUserType="user"><Discover /></ProtectedRoute>} />
        <Route path="/category/:categoryId" element={<ProtectedRoute requiredUserType="user"><CategoryDetails /></ProtectedRoute>} />
        <Route path="/live-streams-feed" element={<ProtectedRoute requiredUserType="user"><LiveStreamsFeed /></ProtectedRoute>} />
        <Route path="/bites" element={<ProtectedRoute requiredUserType="user"><Bites /></ProtectedRoute>} />
        <Route path="/street-explorer" element={<ProtectedRoute requiredUserType="user"><StreetExplorer /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute requiredUserType="user"><Cart /></ProtectedRoute>} />
        <Route path="/order-tracking" element={<ProtectedRoute requiredUserType="user"><OrderTracking /></ProtectedRoute>} />
        <Route path="/order-details" element={<ProtectedRoute requiredUserType="user"><OrderDetails /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute requiredUserType="user"><EditProfile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute requiredUserType="user"><Notifications /></ProtectedRoute>} />
        <Route path="/saved-addresses" element={<ProtectedRoute requiredUserType="user"><SavedAddresses /></ProtectedRoute>} />
        <Route path="/payment-methods" element={<ProtectedRoute requiredUserType="user"><PaymentMethods /></ProtectedRoute>} />
        <Route path="/help-support" element={<ProtectedRoute requiredUserType="user"><HelpSupport /></ProtectedRoute>} />
        <Route path="/support-chat" element={<ProtectedRoute requiredUserType="user"><SupportChat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requiredUserType="user"><Profile /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute requiredUserType="user"><Favorites /></ProtectedRoute>} />
        
        {/* Protected Vendor Routes */}
        <Route path="/vendor/:id" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
        <Route path="/vendor-dashboard" element={<ProtectedRoute requiredUserType="vendor"><VendorDashboard /></ProtectedRoute>} />
        <Route path="/vendor/home" element={<ProtectedRoute requiredUserType="vendor"><VendorHome /></ProtectedRoute>} />
        <Route path="/vendor/live" element={<ProtectedRoute requiredUserType="vendor"><VendorLiveStream /></ProtectedRoute>} />
        <Route path="/vendor/orders" element={<ProtectedRoute requiredUserType="vendor"><VendorOrders /></ProtectedRoute>} />
        <Route path="/vendor/menu" element={<ProtectedRoute requiredUserType="vendor"><VendorMenu /></ProtectedRoute>} />
        <Route path="/vendor/analytics" element={<ProtectedRoute requiredUserType="vendor"><VendorAnalytics /></ProtectedRoute>} />
        <Route path="/vendor/profile" element={<ProtectedRoute requiredUserType="vendor"><VendorProfile /></ProtectedRoute>} />
        <Route path="/vendor/business-info" element={<ProtectedRoute requiredUserType="vendor"><VendorBusinessInfo /></ProtectedRoute>} />
        <Route path="/vendor/profile-settings" element={<ProtectedRoute requiredUserType="vendor"><VendorProfileSettings /></ProtectedRoute>} />
        <Route path="/vendor/notifications" element={<ProtectedRoute requiredUserType="vendor"><VendorNotifications /></ProtectedRoute>} />
        <Route path="/vendor/preferences" element={<ProtectedRoute requiredUserType="vendor"><VendorPreferences /></ProtectedRoute>} />
        <Route path="/vendor/payments-payouts" element={<ProtectedRoute requiredUserType="vendor"><VendorPaymentsPayouts /></ProtectedRoute>} />
        <Route path="/vendor/verification" element={<ProtectedRoute requiredUserType="vendor"><VendorVerification /></ProtectedRoute>} />
        <Route path="/vendor/help-support" element={<ProtectedRoute requiredUserType="vendor"><VendorHelpSupport /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <OrdersProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </OrdersProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
