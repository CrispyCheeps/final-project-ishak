import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { User, LogIn, LogOut, Settings } from 'lucide-react';

const AvatarDropdown = () => {
  const [token, setToken] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and profile picture
    const storedToken = localStorage.getItem("token");
    const storedProfilePicture = localStorage.getItem("profilePicture");
    
    setToken(storedToken);
    setProfilePictureUrl(storedProfilePicture);
  }, []);

  const handleLogin = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setProfilePictureUrl(null);
    navigate('/beranda');
  };

  // Generate initials from user's name or email if available
  const getInitials = () => {
    const userName = localStorage.getItem("userName") || localStorage.getItem("userEmail");
    if (userName) {
      return userName
        .split(' ')
        .map(name => name[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
          {token && profilePictureUrl ? (
            <AvatarImage src={profilePictureUrl} alt="User Avatar" />
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
            {/* <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
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