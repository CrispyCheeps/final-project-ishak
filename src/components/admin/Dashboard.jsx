import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Settings,
  Home,
  BarChart3,
  FileText,
  Bell,
  Search,
  Menu,
  User,
  Shield,
  Image,
  Percent,
  Folder,
  Activity,
} from "lucide-react";
import axios from "@/helpers/axios";
import RoleDropdown from "@/components/admin/RoleDropdown";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([
    { icon: Home, label: "Dashboard", active: false },
    { icon: Users, label: "Users", active: true },
    { icon: Image, label: "Banner", active: false },
    { icon: Percent, label: "Promo", active: false },
    { icon: Folder, label: "Category", active: false },
    { icon: Activity, label: "Activity", active: false },
  ]);
  const [userLoggedIn, setUserLoggedIn] = useState({});

  const fetchUser = () => {
    axios
      .get("/api/v1/user", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserLoggedIn(response.data.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } lg:w-64`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div
              className={`flex items-center gap-2 ${
                sidebarOpen ? "block" : "hidden"
              } lg:block`}
            >
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="font-semibold text-gray-900">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span
                      className={`${sidebarOpen ? "block" : "hidden"} lg:block`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userLoggedIn.profilePictureUrl || "/default-avatar.png"}
                  alt={userLoggedIn.name}
                />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
                <p className="text-sm font-medium text-gray-900">
                  {userLoggedIn.name}
                </p>
                <p className="text-xs text-gray-500">{userLoggedIn.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* main content below */}
    </div>
  );
};

export default Dashboard;
