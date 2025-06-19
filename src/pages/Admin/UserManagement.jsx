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
} from "lucide-react";
import axios from "@/helpers/axios";

const UserManagement = () => {
  // Sample data with more entries for demonstration
  //   const userData = {
  //     "code": "200",
  //     "status": "OK",
  //     "message": "Success",
  //     "data": [
  //       {
  //         "id": "44e5af9b-72d6-4590-a365-17be6bbd6c06",
  //         "name": "satuduatigaempatlima",
  //         "email": "satuduatigaempatlima",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08176931994"
  //       },
  //       {
  //         "id": "18f21d58-b6ab-40fb-aaf0-a65f8d4c006e",
  //         "name": "zoro",
  //         "email": "zoro@gmail.com",
  //         "role": "admin",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722580385593-pngwing.com.png",
  //         "phoneNumber": "09753272456"
  //       },
  //       // Additional sample data to demonstrate pagination
  //       {
  //         "id": "33a4bf7c-82e5-4501-b476-28cf7bce7d07",
  //         "name": "alice",
  //         "email": "alice@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08123456789"
  //       },
  //       {
  //         "id": "22b3ae6b-71d4-4390-a254-16ad5aac5b06",
  //         "name": "bob",
  //         "email": "bob@example.com",
  //         "role": "admin",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722580385593-pngwing.com.png",
  //         "phoneNumber": "08234567890"
  //       },
  //       {
  //         "id": "11c2bd5a-60c3-4289-9143-05bc4999ba05",
  //         "name": "charlie",
  //         "email": "charlie@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08345678901"
  //       },
  //       {
  //         "id": "00b1ac49-5fb2-4178-8032-f4ab3888a904",
  //         "name": "diana",
  //         "email": "diana@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08456789012"
  //       },
  //       {
  //         "id": "ff01bb38-4ea1-4067-7f21-e3982777b803",
  //         "name": "eve",
  //         "email": "eve@example.com",
  //         "role": "admin",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722580385593-pngwing.com.png",
  //         "phoneNumber": "08567890123"
  //       },
  //       {
  //         "id": "ee00aa27-3d90-3f56-6e10-d2871666c702",
  //         "name": "frank",
  //         "email": "frank@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08678901234"
  //       },
  //       {
  //         "id": "dd99bb16-2c8f-2e45-5d0f-c1760555b601",
  //         "name": "grace",
  //         "email": "grace@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08789012345"
  //       },
  //       {
  //         "id": "cc88aa05-1b7e-1d34-4c0e-b0654444a500",
  //         "name": "henry",
  //         "email": "henry@example.com",
  //         "role": "admin",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722580385593-pngwing.com.png",
  //         "phoneNumber": "08890123456"
  //       },
  //       {
  //         "id": "bb7799f4-0a6d-0c23-3b0d-9f543333940f",
  //         "name": "iris",
  //         "email": "iris@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "08901234567"
  //       },
  //       {
  //         "id": "aa6688e3-f95c-fb12-2a0c-8e432222830e",
  //         "name": "jack",
  //         "email": "jack@example.com",
  //         "role": "user",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722960869471-pngwing.com-(3).png",
  //         "phoneNumber": "09012345678"
  //       },
  //       {
  //         "id": "995577d2-e84b-ea01-190b-7d321111720d",
  //         "name": "kate",
  //         "email": "kate@example.com",
  //         "role": "admin",
  //         "profilePictureUrl": "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1722580385593-pngwing.com.png",
  //         "phoneNumber": "09123456789"
  //       }
  //     ]
  //   };

  const [userData, setUserData] = useState([]);

  const fetchUserData = () => {
    axios
      .get("/api/v1/all-user", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.code === "200") {
          console.log("User data fetched successfully:", response.data);
          setUserData(response.data.data);
        } else if (
          response.data.code === "401" ||
          response.data.code === "403"
        ) {
          console.error("Unauthorized access:", response.data.message);
          alert("Unauthorized access. Please log in again.");
          // Optionally redirect to login or show an error message
        } else {
          console.error("Failed to fetch user data:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 10;
  const totalItems = userData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = userData.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getRoleVariant = (role) => {
    return role === "admin" ? "destructive" : "secondary";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: Users, label: "Users", active: true },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: FileText, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

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
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                User Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage and monitor all users
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                {totalItems} users
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A comprehensive list of all users in your system with their
                details and roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          User
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Role
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Phone
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((user, index) => (
                        <tr
                          key={user.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.profilePictureUrl}
                                  alt={user.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={getRoleVariant(user.role)}
                              className="capitalize"
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{user.phoneNumber}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs font-mono text-muted-foreground">
                              {user.id.slice(0, 8)}...
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)}{" "}
                  of {totalItems} users
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Status: {userData.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Code: {userData.code}
                    </Badge>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        // Show current page, first page, last page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage && page === currentPage - 2) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        if (!showPage && page === currentPage + 2) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        if (!showPage) return null;

                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(page)}
                            className="h-8 w-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
