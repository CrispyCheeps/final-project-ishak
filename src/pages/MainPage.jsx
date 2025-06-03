import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { use, useEffect, useState } from "react";
import axios from "@/helpers/axios";
import { getPromos } from "@/features/mainPage/PromosSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setPromos,
  setLoadingPromo,
  setError,
} from "@/features/mainPage/PromosSlice";
import PromoCard from "@/components/PromoCard";
import Footer from "@/components/footer";

export default function MainPage() {
  const [dataPromo, setDataPromo] = useState([]);
  const dispatch = useDispatch();
  const { promos, loadingPromo, error } = useSelector((state) => state.promos);
  const {menu} = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(getPromos());
  }, [dispatch]);

  console.log("Promos:", promos);
  console.log("Menu:", menu);

  return (
    <>
      <Navbar />
      <section className="my-12 flex items-center justify-center">
        <div className="relative w-full h-[420px] bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2025/01/05/1736039117166-e16913199b4e62397ea8435ddd83b811.png?tr=dpr-2,q-75')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Tempat wisata di
            </h1>
            {menu === "promos" && (
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {/* Dropdown - bisa pakai shadcn Popover + Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-full bg-white text-[#2BAE91] px-6 py-2 hover:bg-gray-100">
                      <MapPin className="w-4 h-4 mr-2" /> Pilih destinasi
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                  //   side="top" // "top" | "right" | "bottom" | "left"
                  //   align="start" // "start" | "center" | "end"
                  //   sideOffset={8} // Distance from trigger (in pixels)
                  //   alignOffset={0}
                  >
                    {/* Ambil dari category name di endpoint category, di mapping */}
                    <DropdownMenuItem>Jakarta</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Search */}
                <div className="flex bg-white rounded-full items-center px-4 py-2 shadow-lg w-full max-w-md">
                  <Search className="text-gray-400 w-4 h-4 mr-2" />
                  <input
                    placeholder="Cari destinasi atau aktivitas"
                    className="w-full outline-none text-gray-700"
                  />
                  <Button className="ml-2 rounded-full bg-[#2BAE91] hover:bg-[#329AC0] text-white px-6">
                    Cari
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div>
        {loadingPromo ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div className="w-[392px] mx-8 my-8 h-[50px] rounded-xl  bg bg-gradient-to-r from-[#2BAE91] to-[#329AC0] text-white py-4 text-center">
              <h1 className="text-2xl">Promo Special</h1>
            </div>
            <div className="flex flex-wrap gap-4 mx-8">
              {promos.map((promo) => (
                <PromoCard
                  key={promo.id}
                  title={promo.title}
                  imageUrl={promo.imageUrl}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
