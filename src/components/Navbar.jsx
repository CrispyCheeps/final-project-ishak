import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux';


const listItems = [
    "Things to do",
    "Categories",
    "Promo",
    "Purchase Lists"
];
const Navbar = () => {
    const { profilePictureUrl } = useSelector((state) => state.auth);
    console.log("Profile Picture URL:", profilePictureUrl);
  return (
    <div className="fixed bg-black flex justify-between items-center gap-16 py-3 px-10 left-1/2 translate-x-[-50%] top-[20px] rounded-full backdrop-blur-md bg-opacity-60 text-white shadow-lg">
      <ul className="flex gap-8 text-ul">
        {
            listItems.map((item) => (
                <li className='relative group cursor-pointer' key={item}>
                    {item}
                    <span className='absolute left-0 bottom-[-5px] w-0 h-1 rounded-xl bg-gradient-to-r from-blue-500 to-green-to-500 transition-all duration-300 group-hover:w-full'></span>
                </li>
            ))
        }
      </ul> 

      <button className="bg-gradient-to-r from-blue-500 to-green-400 py-1 px-6 rounded-3xl shadow-2xl text-white text-;g font-semibold hover:from-blue-600 hover:to-green-500 hover:shadow-green-500 shadow-blue-500">
        Travel. Inc
      </button>

       <Avatar className={"w-10 h-10 cursor-pointer"}>
        <AvatarImage src={profilePictureUrl} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Navbar;
