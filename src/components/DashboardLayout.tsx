import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Plus,
  Home,
  LogIn,
  DollarSign,
  FileCheck,
  MessageSquare,
  Mail,
  Users,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "./signIn/SignInModal";
import React from "react";
const favicon = new URL("../assets/FOUNDIFY-LOGO.svg", import.meta.url).href;

interface DashboardLayoutProps {
  children: React.ReactNode;
  isPremium: boolean;
}

export function DashboardLayout({ children, isPremium }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isEssentialsOpen, setIsEssentialsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      icon: DollarSign,
    },
    {
      path: "/dashboard/contracts",
      label: "Contract Templates",
      icon: FileCheck,
    },
    {
      path: "/dashboard/feedbackCoach",
      label: "360° Feedback Generator",
      icon: MessageSquare,
    },
    {
      path: "/dashboard/investor-email-draft",
      label: "Investor Email Draft",
      icon: Mail,
    },
    {
      path: "/dashboard/ai-hiring-assistant",
      label: "AI Hiring Assistant",
      icon: Users,
    },
    {
      path: "/dashboard/landing-page-generator",
      label: "Landing Page Generator",
      icon: Globe,
    },
  ];

  const currentPath = location.pathname;

  // Auto-open essentials menu when on any essentials page
  useEffect(() => {
    const essentialsPages = [
      "/dashboard/invoices",
      "/dashboard/contracts",
      "/dashboard/feedbackCoach",
      "/dashboard/investor-email-draft",
      "/dashboard/ai-hiring-assistant",
      "/dashboard/landing-page-generator",
    ];

    if (essentialsPages.some((page) => currentPath.startsWith(page))) {
      setIsEssentialsOpen(true);
    }
  }, [currentPath]);

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-7 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <img
                src={favicon}
                alt="Foundify"
                className="h-8 w-auto cursor-pointer select-none"
                onClick={() => navigate("/")}
              />
              {/* <h1 className="text-2xl font-bold text-deep-blue">Foundify</h1> */}
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            // Check if this is an essentials-related page
            const essentialsPages = [
              "/dashboard/invoices",
              "/dashboard/contracts",
              "/dashboard/feedbackCoach",
              "/dashboard/investor-email-draft",
              "/dashboard/ai-hiring-assistant",
              "/dashboard/landing-page-generator",
            ];

            const isActive = item.hasSubMenu
              ? essentialsPages.some((page) => currentPath.startsWith(page))
              : item.path && currentPath.startsWith(item.path);

            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    if (item.hasSubMenu) {
                      setIsEssentialsOpen(!isEssentialsOpen);
                    } else {
                      navigate(item.path);
                      setIsSidebarOpen(false); // Close sidebar on mobile after navigation
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-premium-purple to-deep-blue text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                  {item.hasSubMenu && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isEssentialsOpen ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Sub-menu items */}
                {item.hasSubMenu && isEssentialsOpen && (
                  <div className="mt-1 space-y-1">
                    {essentialsSubItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubItemActive = currentPath.startsWith(
                        subItem.path
                      );

                      return (
                        <button
                          key={subItem.path}
                          onClick={() => {
                            navigate(subItem.path);
                            setIsSidebarOpen(false); // Close sidebar on mobile after navigation
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3  rounded-xl transition-all duration-200 ${
                            isSubItemActive
                              ? "bg-purple-50 text-premium-purple font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <SubIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 text-left text-sm">
                            {subItem.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Hamburger Menu Button for Mobile/Tablet */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              {/* <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {currentTitle}
              </h2> */}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-3 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName || "User"}
                        />
                        <AvatarFallback className="bg-deep-blue text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-xl border border-gray-200 shadow-lg"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsSignInModalOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-4 py-2"
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
