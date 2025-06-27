import { Button } from "@/components/ui/button";
import { ChevronDown, Icon, MapPin, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "@/helpers/axios";
import { useLocation } from "react-router-dom";

export default function HeroSection({ handleSearchChange, getByCategoryId }) {
  const [inputValue, setInputValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;
  const handleClickSearch = () => {
    handleSearchChange(inputValue);
  };

  const getCategories = () => {
    axios
      .get("/api/v1/categories", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <section className="my-12 flex items-center justify-center">
        <div className="relative w-full h-[420px] bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2025/01/05/1736039117166-e16913199b4e62397ea8435ddd83b811.png?tr=dpr-2,q-75')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Petualangan Seru Menantimu di Nusantara
            </h1>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Dropdown - bisa pakai shadcn Popover + Button */}
              <DropdownMenu>
                {currentPath !== "/categories" && (
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-full bg-white text-[#2BAE91] px-6 py-2 hover:bg-gray-100">
                      <MapPin className="w-4 h-4 mr-2" /> Pilih destinasi atau
                      category
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                )}
                <DropdownMenuContent>
                  {/* Ambil dari category name di endpoint category, di mapping */}
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => {
                        setCategoryId(category.id);
                        getByCategoryId(category.id);
                      }}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search */}
              <div className="flex bg-white rounded-full items-center px-4 py-2 shadow-lg w-full max-w-md">
                <Search className="text-gray-400 w-4 h-4 mr-2" />
                <input
                  placeholder="Cari petualangan di..."
                  className="w-full outline-none text-gray-700"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
                <Button
                  onClick={() => {
                    handleClickSearch();
                  }}
                  className="ml-2 rounded-full bg-[#2BAE91] hover:bg-[#329AC0] text-white px-6"
                >
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
