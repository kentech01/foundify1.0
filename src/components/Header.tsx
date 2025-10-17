import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { UserAuth } from "../context/AuthContext";
// import favicon from "../assets/FOUNDIFY-LOGO.svg";

interface HeaderProps {
  onDashboardClick?: () => void;
  handleOpenSignInModal?: () => void;
}

export function Header({
  onDashboardClick,
  handleOpenSignInModal,
}: HeaderProps = {}) {
  const { user, logOut } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const navigate = useNavigate();
  const favicon = new URL("../assets/FOUNDIFY-LOGO.svg", import.meta.url).href;

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };
  return (
    <header className="bg-white border-b border-gray-200 bg-white/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src={favicon}
                alt="Foundify"
                className="h-8 w-auto cursor-pointer select-none"
                onClick={() => navigate("/")}
              />
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-xl px-3 py-2"
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
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.displayName || "User"}
                    </span>
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
                  {onDashboardClick && (
                    <>
                      <DropdownMenuItem
                        onClick={onDashboardClick}
                        className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg mx-1 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  {/* <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg mx-1">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg mx-1">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleOpenSignInModal}
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-4 py-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
