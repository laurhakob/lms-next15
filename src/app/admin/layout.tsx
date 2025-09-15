"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CirclePlus,
  LayoutDashboard,
  List,
  BarChart2,
  File,
  Users,
  Settings,
  HelpCircle,
  Search,
  Loader,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotted-separator";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#195a5a] to-[#2a7b7b] text-white flex relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-[#195a5a]/80 backdrop-blur-sm border-r border-white/20 flex flex-col justify-between p-6 transition-all duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {/* Logo and LMS Text */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="mr-2 cursor-pointer group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 group-hover:brightness-125 transition-all duration-300">
                LMS
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              onClick={toggleSidebar}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DottedSeparator className="mb-6" color="rgba(255,255,255,0.3)" />

          {/* Navigation Buttons */}
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="/admin/courses/create">
                <CirclePlus className="w-5 h-5 mr-2" />
                Quick Create
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="/admin/dashboard">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="/admin/courses">
                <List className="w-5 h-5 mr-2" />
                Courses
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="/admin/analytics">
                <BarChart2 className="w-5 h-5 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="/admin/projects">
                <File className="w-5 h-5 mr-2" />
                Projects
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              asChild
            >
              <Link href="/admin/team">
                <Users className="w-5 h-5 mr-2" />
                Team
              </Link>
            </Button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          <DottedSeparator className="my-4" color="rgba(255,255,255,0.3)" />
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
            asChild
          >
            <Link href="/admin/settings">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
            asChild
          >
            <Link href="/admin/help">
              <HelpCircle className="w-5 h-5 mr-2" />
              Get Help
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white transition-all duration-300"
            asChild
          >
            <Link href="/admin/search">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Link>
          </Button>
          <DottedSeparator className="my-4" color="rgba(255,255,255,0.3)" />
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader className="size-10 animate-spin text-white/70" />
              <p className="text-sm text-white/70">Loading user...</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-white/30">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="bg-white/20 text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white/70">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 bg-green-50 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {!isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 text-[#195a5a] hover:bg-[#195a5a]/10 hover:text-[#195a5a] transition-all duration-300 shadow-md rounded-full bg-white/80 backdrop-blur-sm z-50"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </Button>
        )}
        {children}
      </main>
    </div>
  );
}
