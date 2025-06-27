import RoleDropdown from "@/components/admin/RoleDropdown";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Bell, Search, ChevronLeft,
  ChevronRight, } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/helpers/axios";
import { Input } from "@/components/ui/input";

export default function UsersPageAdmin() {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleRoleChange = (userId, newRole) => {
    setUserData((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    axios
      .post(
        `/api/v1/update-user-role/${userId}`,
        {
          role: newRole,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.code === "200") {
          alert("User role updated successfully.");
        } else {
          W;
          alert("Failed to update user role. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error updating role:", err);
        alert("Failed to update user role. Please try again.");
      });
  };

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

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = userData.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(query) ||
          (user.email || "").toLowerCase().includes(query) ||
          (user.role || "").toLowerCase().includes(query) ||
          (user.phone || "").toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(userData);
    }
  }, [searchQuery, userData]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = userData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

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

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {/* <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div> */}

        {/* Content Below */}
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  User Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage and monitor all users
                </p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <Input
                  type="text"
                  placeholder="Search by name, email, role, or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <RoleDropdown
                                user={user}
                                onRoleChange={handleRoleChange}
                              />
                            </td>
                            <td className="p-4">
                              <div className="text-sm">{user.phoneNumber}</div>
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
                            (page >= currentPage - 1 &&
                              page <= currentPage + 1);

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
      </SidebarInset>
    </SidebarProvider>
  );
}
