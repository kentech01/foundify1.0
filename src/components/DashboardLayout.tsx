import { useState } from "react";
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
  User,
  Plus,
  Home,
  LogIn,
} from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import SignInModal from "./signIn/SignInModal";
import React from "react";
const favicon = new URL("../assets/FOUNDIFY-LOGO.svg", import.meta.url).href;

interface DashboardLayoutProps {
  children: React.ReactNode;
  onCreatePitch: () => void;
  isPremium: boolean;
}

export function DashboardLayout({
  children,
  onCreatePitch,
  isPremium,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut, loading } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const navItems = [
    {
      path: "/dashboard/pitches",
      label: "Pitch Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/dashboard/essentials",
      label: "Founder Essentials",
      icon: Wrench,
      premium: false,
    },
  ];

  const currentPath = location.pathname;

  console.log(currentPath, "currentPath");
  const currentTitle =
    navItems.find((item) => currentPath.startsWith(item.path))?.label ||
    "Dashboard";

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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
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
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath.startsWith(item.path) ||
              (item.path === "/dashboard/essentials" &&
                currentPath === "/dashboard/invoices");
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
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
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentTitle}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {currentPath.startsWith("/dashboard/pitches") && (
                <Button
                  onClick={onCreatePitch}
                  className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white rounded-xl shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Pitch
                </Button>
              )}

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
                    {/* <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg mx-1">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg mx-1">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
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
