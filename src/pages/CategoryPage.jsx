import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "@/helpers/axios";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Icon, MapPin, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import { current } from "@reduxjs/toolkit";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [showAllItems, setShowAllItems] = useState(false);

  const filteredCategories = categories.filter((category) => {
    return category.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayedCategories = showAllItems
    ? filteredCategories
    : filteredCategories.slice(0, itemsToShow);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleShowMore = () => {
    if (showAllItems) {
      // Kembali ke tampilan awal
      setShowAllItems(false);
      setItemsToShow(3);
      // Scroll ke bagian activities
      setTimeout(() => {
        const activitiesSection = document.querySelector(".activities-header");
        if (activitiesSection) {
          activitiesSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      // Cek apakah dengan menambah 3 item akan melebihi total
      if (itemsToShow + 3 >= filteredCategories.length) {
        setShowAllItems(true);
      } else {
        setItemsToShow((prev) => prev + 3);
      }
    }
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
      .catch((err) => {});
  };

  const getByCategoryId = (categoryId) => {
    setLoading(true);
    axios
      .get(`/api/v1/category/${categoryId}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.code == "200") {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Navbar show={showNavbar} />

      <HeroSection
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        getByCategoryId={getByCategoryId}
      />

      <div>
        <div className="activities-header w-[200px] mx-8 my-8 h-[50px] rounded-xl bg-gradient-to-r from-[#2BAE91] to-[#329AC0] text-white flex items-center justify-center ">
          <span className="text-2xl font-semibold">Category</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mx-8 mb-30">
        {categories.length > 0 ? (
          displayedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              imageUrl={category.imageUrl}
              name={category.name}
            />
          ))
        ) : (
          /* Pesan jika tidak ada hasil */
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center mx-8 mb-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada kategori ditemukan
            </h3>
          </div>
        )}
      </div>
      {/* Tombol Lihat Selengkapnya */}
      {categories.length > 3 && (
        <div className="flex justify-center mb-12">
          <Button
            onClick={handleShowMore}
            className="px-8 py-3 bg-gradient-to-r from-[#2BAE91] to-[#329AC0] hover:from-[#248F78] hover:to-[#2A85A0] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            {showAllItems ? (
              <>
                <ChevronDown className="w-5 h-5 rotate-180 transition-transform duration-300" />
                Tampilkan Lebih Sedikit
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                Lihat Selengkapnya (
                {categories.length - displayedCategories.length} lainnya)
              </>
            )}
          </Button>
        </div>
      )}

      <Footer />
    </>
  );
}
