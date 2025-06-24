import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogIn, LogOut, Settings } from "lucide-react";
import axios from "@/helpers/axios";

const AvatarDropdown = () => {
  const [token, setToken] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const getLoggedInUser = () => {
    axios
      .get("/api/v1/user", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("User data fetched successfully:", response.data);
        setUserData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    // Check for token and profile picture
    const storedToken = localStorage.getItem("token");
    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedToken) {
      getLoggedInUser();
    }

    setToken(storedToken);
    setProfilePictureUrl(storedProfilePicture);
  }, []);

  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    axios
      .get("/api/v1/logout", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.code === "200") {
          console.log("Logout successful:", res.data);
          alert("Logout berhasil");
          setUserData(null);
          localStorage.removeItem("token");
          navigate("/beranda");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Logout gagal, silakan coba lagi");
      });
  };

  // Generate initials from user's name or email if available
  const getInitials = () => {
    const userName = userData?.name || userData?.email;
    if (userName) {
      return userName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
          {token && userData?.profilePictureUrl ? (
            <AvatarImage src={userData.profilePictureUrl} alt="User Avatar" />
          ) : (
            <AvatarFallback className="bg-black text-white font-semibold">
              {token ? getInitials() : <User className="w-5 h-5" />}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        {token ? (
          // Logged in menu
          <>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          // Not logged in menu
          <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Log in</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
