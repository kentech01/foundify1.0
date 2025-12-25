import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { UserAuth } from "../../context/AuthContext";
// import favicon from "../assets/FOUNDIFY-LOGO.svg";

interface HeaderProps {
  onDashboardClick?: () => void;
  handleOpenSignInModal?: () => void;
}

export function LandingHeader({
  onDashboardClick,
  handleOpenSignInModal,
}: HeaderProps = {}) {
  const { user, logOut } = UserAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const navigate = useNavigate();
  const favicon = new URL("../../assets/FOUNDIFY-LOGO.svg", import.meta.url)
    .href;

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
    <header className="absolute z-30 w-full top-0 left-0">
      <div className="mx-auto  px-3 py-2 sm:px-6 lg:px-36">
        <div className="flex justify-between items-center h-16 ">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mt">
              <img
                src={favicon}
                alt="Foundify"
                className="h-7 w-auto cursor-pointer select-none"
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
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-3 py-2"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback className="bg-[#8B4513] text-sm text-white font-semibold">
                        {user.displayName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm sm:block text-gray-900 font-medium">
                      {user.displayName || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-900" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border border-gray-200 shadow-lg bg-white"
                >
                  <div className="px-3 py-3">
                    <p className="text-xl font-bold text-[#1f1147]">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  {onDashboardClick && (
                    <>
                      <DropdownMenuItem
                        onClick={onDashboardClick}
                        className="flex items-center gap-2 px-3 py-3 text-md text-[#1f1147] hover:bg-gray-50 rounded-lg mx-1 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200" />
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
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="flex items-center gap-2 px-3 py-3 text-md text-[#1f1147] hover:bg-gray-50 rounded-lg mx-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-7 text-xl underline figtree">
                <a href="">View Demo</a>
                <button
                onClick={handleOpenSignInModal}
                className="flex items-center gap-2 hover:bg-[rgba(0,0,0,0.1)] rounded-xl px-8 transition py-2 border-1 rounded-lg border-[#000]"
              >
                <span className="text-lg figtree">Sign In</span>
              </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
