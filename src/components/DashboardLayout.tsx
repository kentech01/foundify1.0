import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import {
  LayoutDashboard,
  Wrench,
  LogOut,
  ChevronDown,
  ChevronRight,
  LogIn,
  FileText,
  FileCheck,
  MessageSquare,
  Mail,
  Users,
  Menu,
  X,
  Home,
  Settings,
  QrCode,
  Globe,
  User,
  Plus,
  HomeIcon,
  Brain,
  Bot,
  IdCard,
  CreditCard,
} from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "./signIn/SignInModal";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isPremium: boolean;
}

export function DashboardLayout({ children, isPremium }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      path: "/dashboard/pitches",
      label: "Pitch Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "", // No path - just a menu header
      label: "Founder Essentials",
      icon: Wrench,
      premium: false,
      hasSubMenu: true,
    },
  ];

  const essentialsSubItems = [
    {
      path: "/dashboard/invoices",
      label: "Invoice Generator",
      icon: CreditCard,
    },
    {
      path: "/dashboard/contracts",
      label: "Contract Templates",
      icon: FileText,
    },
    {
      path: "/dashboard/investor-email-draft",
      label: "Email Generation",
      icon: Mail,
    },
    {
      path: "/dashboard/qr-card",
      label: "Smart Digital Card",
      icon: IdCard,
    },
    {
      path: "/dashboard/feedbackCoach",
      label: "Team Insights",
      icon: Users,
    },
    {
      path: "/dashboard/ai-hiring-assistant",
      label: "AI Hiring Assistant",
      icon: Bot,
    },
    // {
    //   path: "/dashboard/landing-page-generator",
    //   label: "Landing Page Generator",
    //   icon: Globe,
    // },
  ];

  const currentPath = location.pathname;

  // Auto-open essentials menu when on any essentials page
  

  const handleSignOut = async () => {
    try {
      await logOut();

      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  const essentialsPages = [
    "/dashboard/invoices",
    "/dashboard/contracts",
    "/dashboard/feedbackCoach",
    "/dashboard/investor-email-draft",
    "/dashboard/ai-hiring-assistant",
    "/dashboard/qr-card",
    "/dashboard/landing-page-generator",
  ];

  const isFounderEssentialsActive = essentialsPages.some((page) =>
    currentPath.startsWith(page)
  );

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">foundify</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Pitch Dashboard */}
        <button
          onClick={() => {
            navigate("/dashboard/pitches");
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200 ${
            currentPath.startsWith("/dashboard/pitches")
              ? "bg-white/20 text-white"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Brain className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-left font-semibold text-sm">
            Company Dashboard
          </span>
        </button>

        {/* Founder Essentials - Collapsible */}
        <div className="space-y-1">
          <h1
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-[10px] transition-all duration-200 `}
          >
            <span className="flex-1 text-left font-semibold text-sm">
              Founder Essentials
            </span>
          </h1>

          {/* Sub-items */}
          
            <div className="space-y-1 mt-1">
              {essentialsSubItems.map((subItem) => {
                const Icon = subItem.icon;
                const isSubItemActive = currentPath.startsWith(subItem.path);
                return (
                  <button
                    key={subItem.path}
                    onClick={() => {
                      navigate(subItem.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[8px] transition-all duration-200 ${
                      isSubItemActive
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left text-sm">
                      {subItem.label}
                    </span>
                  </button>
                );
              })}
            </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {/* <button
          onClick={() => {
            navigate("/");
            setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <Home className="h-5 w-5" />
          <span className="text-sm">Back to Home</span>
        </button> */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
          <Settings className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col" style={{ backgroundColor: '#1f2937' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0"
          style={{ backgroundColor: 'rgba(37, 41, 82, 1)' }}
        >
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-[#EEF0FF] rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>

            {/* Page Title - Removed */}
            <div className="flex-1 lg:ml-0 ml-4">
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {currentPath.startsWith("/dashboard/pitches") && (
                <Button
                  onClick={() => navigate("/builder")}
                  className="bg-[#252952] hover:bg-[#1a1d3a] text-white rounded-[10px] shadow-sm px-3 lg:px-4 transition-all duration-300"
                >
                  <Plus className="mr-0 lg:mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">Create New</span>
                </Button>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-[#EEF0FF] rounded-xl px-2 lg:px-3 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-[#252952] to-[#4A90E2] text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-2xl border border-gray-200 shadow-xl p-0 overflow-hidden"
                  >
                    <div className="px-6 py-6 bg-white">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {user.displayName || "User"}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="px-4 py-2 bg-[#EEF0FF]">
                      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-white rounded-xl transition-colors cursor-pointer">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-white rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsSignInModalOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-[#EEF0FF] rounded-xl px-4 py-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />
    </div>
  );
}
