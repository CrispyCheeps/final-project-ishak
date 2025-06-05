import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "@/helpers/axios";
import { useEffect, useState } from "react";
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

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    axios
      .get("/api/v1/categories", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Navbar />

      <HeroSection />

      <div className="flex flex-wrap gap-4 mx-8">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            imageUrl={category.imageUrl}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
