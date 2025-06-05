import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const listItems = ["activities", "categories", "purchased"];

const Navbar = () => {
  const { profilePictureUrl } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { menu } = useSelector((state) => state.menu);

  return (
    <div className="fixed w-[90%] md:w-[55%] bg-gradient-to-r from-[#2BAE91] to-[#329AC0] flex justify-between items-center py-3 px-6 md:px-10 left-1/2 translate-x-[-50%] top-[20px] rounded-full backdrop-blur-md bg-opacity-60 text-white shadow-lg z-50">
      {/* Burger Menu (Mobile Only) */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <ul
        className={`absolute md:static top-16 md:top-auto left-0 md:left-auto w-full md:w-auto bg-gradient-to-r from-[#2BAE91] to-[#329AC0] md:bg-transparent flex-col md:flex-row items-center md:flex gap-6 text-ul transition-all duration-300 ease-in-out md:gap-8 ${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:flex py-4 md:py-0 px-6 md:px-0 rounded-xl md:rounded-none`}
      >
        {listItems.map((item, index) => (
          <li 
            className="relative group cursor-pointer font-bold" 
            key={item} 
            onClick={() => navigate(`/${item}`)}
          >
            {item}
            <span className="absolute left-0 bottom-[-5px] w-0 h-1 rounded-xl bg-gradient-to-r from-[#939393] to-white transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* Logo */}
      <div className="hidden md:block">
        <button onClick={() => navigate("/beranda")} className="bg-white py-1 px-4 rounded-xl shadow-2xl text-white font-semibold hover:from-blue-600 hover:to-green-500 hover:shadow-green-500 shadow-blue-500">
          <img className="h-8" src="images/logo-kecil.png" alt="" />
        </button>
      </div>

      {/* Avatar */}
      <Avatar className="w-10 h-10 cursor-pointer">
        <AvatarImage src={profilePictureUrl} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Navbar;