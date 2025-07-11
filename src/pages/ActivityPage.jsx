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
import ActivityCard from "@/components/ActivityCard";
import { useSearchParams } from "react-router-dom";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsToShow, setItemsToShow] = useState(6); // Menampilkan 8 item pertama
  const [showAllItems, setShowAllItems] = useState(false);
  const [searchParams] = useSearchParams();
  const categoryIdParam = searchParams.get("category");

  const filteredActivities = activities.filter((activity) => {
    return activity.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Data yang akan ditampilkan berdasarkan itemsToShow atau showAllItems
  const displayedActivities = showAllItems
    ? filteredActivities
    : filteredActivities.slice(0, itemsToShow);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Reset ke tampilan awal saat melakukan pencarian
    setShowAllItems(false);
    setItemsToShow(6);
  };

  const handleShowMore = () => {
    if (showAllItems) {
      // Kembali ke tampilan awal
      setShowAllItems(false);
      setItemsToShow(6);
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
      if (itemsToShow + 3 >= filteredActivities.length) {
        setShowAllItems(true);
      } else {
        setItemsToShow((prev) => prev + 3);
      }
    }
  };

  const getActivities = () => {
    axios
      .get("/api/v1/activities", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.code == "200") {
          setActivities(res.data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getActivitiesById = () => {
    axios
      .get(`/api/v1/activities-by-category/${categoryIdParam}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.code == "200") {
          setActivities(res.data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getActivityByCategoryId = (categoryId) => {
    setLoading(true);
    // Reset pagination saat memilih kategori
    setShowAllItems(false);
    setItemsToShow(8);

    axios
      .get(`/api/v1/activities-by-category/${categoryId}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.code == "200") {
          setActivities(res.data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (categoryIdParam) {
      getActivitiesById();
    } else {
      getActivities();
    }
  }, [categoryIdParam]);

  return (
    <>
      <Navbar show={showNavbar} />

      <HeroSection
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        getByCategoryId={getActivityByCategoryId}
      />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2BAE91] border-t-transparent"></div>
            <h1 className="text-xl font-semibold text-gray-700">
              Loading activities...
            </h1>
          </div>
        </div>
      ) : activities.length > 0 ? (
        <>
          <div className="activities-header w-[200px] mx-8 my-8 h-[50px] rounded-xl bg-gradient-to-r from-[#2BAE91] to-[#329AC0] text-white">
            <div className="flex items-center justify-center gap-3 py-4">
              <svg
                fill="#000000"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 492.75 492.75"
                xml:space="preserve"
                className="w-8 h-8 brightness-0 invert"
              >
                <g>
                  <g>
                    <path d="M45.082,121.589l-2.227,20.876l53.434,63.486l9.276-68.475c0.433-3.196,1.338-6.191,2.199-9.202L45.082,121.589z" />
                    <path
                      d="M90.538,248.414l2.799-20.661l-52.876-62.832l-7.819,73.314c-1.941,18.178,11.223,34.478,29.402,36.422l31.597,3.37
			C90.491,268.769,89.137,258.765,90.538,248.414z"
                    />
                    <path
                      d="M200.385,124.129c-4.577-12.695-18.593-19.301-31.296-14.693c-12.703,4.585-19.286,18.593-14.693,31.296l29.665,82.164
			c2.69,7.474,8.851,13.173,16.516,15.274l76.894,21.14c2.165,0.597,4.346,0.884,6.495,0.884c10.729,0,20.575-7.124,23.56-17.98
			c3.582-13.021-4.075-26.473-17.097-30.054l-64.678-17.781L200.385,124.129z"
                    />
                    <path
                      d="M280.893,391.117l-10.053-69.35c-1.162-8.007-5.667-15.139-12.393-19.636l-40.759-27.214l-14.318-9.56
			c0.062-0.417,0.14-0.945,0.237-1.622l1.021-7.543l-8.376-2.303c-12.767-3.51-23.034-13.006-27.531-25.454l-9.316-25.806
			l-50.052,28.345c0,0-1.994,14.721-2.658,19.627c-0.562,4.143-0.673,17.777,1.162,23.663c2.9,9.306,11.608,37.224,11.608,37.224
			l15.589,49.994l-21.801,82.896c-4.012,15.242,5.094,30.843,20.328,34.846c2.436,0.637,4.879,0.947,7.275,0.947
			c12.647,0,24.204-8.477,27.571-21.275l23.886-90.824c1.361-5.182,1.242-10.642-0.358-15.752l-10.235-32.818l34.479,23.02
			l8.229,56.774c2.062,14.208,14.255,24.443,28.2,24.435c1.361,0,2.738-0.095,4.123-0.294
			C272.345,421.18,283.154,406.71,280.893,391.117z"
                    />
                    <path
                      d="M464.069,212.629c-7.195-5.42-17.423-3.972-22.827,3.216l-61.184,81.297c-1.21,1.615-2.117,3.43-2.666,5.372
			l-25.191,89.089l-38.658,5.524c-2.006,0.287-3.94,0.939-5.707,1.942l-111.908,63.189c-7.84,4.425-10.602,14.367-6.177,22.207
			c2.993,5.309,8.517,8.286,14.208,8.286c2.714,0,5.468-0.677,7.998-2.109l109.234-61.677l46.116-6.59
			c6.376-0.907,11.621-5.492,13.38-11.7l27.253-96.356l59.345-78.861C472.706,228.261,471.257,218.042,464.069,212.629z"
                    />
                    <path
                      d="M51.776,113.025l59.31,6.33l7.516,0.802c3.691,0.394,7.354,0.03,10.903-0.787c-3.937,5.952-6.764,12.751-7.782,20.296
			l-9.621,71.021l41.688-23.61l-14.732-40.805c-3.945-10.929-2.855-22.401,1.961-32.034c0.618-0.432,1.294-0.759,1.884-1.236
			c4.128-3.335,7.215-7.641,9.327-12.404c1.381-3.115,2.426-6.39,2.794-9.843c0.283-2.648,0.159-5.231-0.168-7.762
			c-1.918-14.836-13.704-27-29.233-28.659l-66.851-7.132c-8.724-0.932-17.455,1.639-24.284,7.146
			c-6.821,5.517-11.184,13.507-12.114,22.255C20.432,94.783,33.597,111.084,51.776,113.025z"
                    />
                  </g>
                  <circle cx="200.891" cy="47.5" r="47.5" />
                </g>
              </svg>
              <span className="text-2xl font-semibold">Activities</span>
            </div>
          </div>

          {/* Informasi hasil pencarian */}
          {searchQuery && (
            <div className="mx-8 mb-4">
              <p className="text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold text-[#2BAE91]">
                  {displayedActivities.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold">
                  {filteredActivities.length}
                </span>{" "}
                aktivitas untuk "{searchQuery}"
              </p>
            </div>
          )}

          {/* Grid Activities */}
          {filteredActivities.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-4 mx-8 mb-8">
                {displayedActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    id={activity.id}
                    imageUrl={activity.imageUrls}
                    title={activity.title}
                    price={activity.price}
                    discount={activity.price_discount}
                    totalReview={activity.total_reviews}
                    facilities={activity.facilities}
                    address={activity.address}
                    province={activity.province}
                    city={activity.city}
                    location={activity.location_maps}
                    category={activity.category}
                  />
                ))}
              </div>

              {/* Tombol Lihat Selengkapnya */}
              {filteredActivities.length > 3 && (
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
                        {filteredActivities.length - displayedActivities.length}{" "}
                        lainnya)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Pesan jika tidak ada hasil */
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center mx-8 mb-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tidak ada aktivitas ditemukan
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchQuery
                  ? `Tidak ditemukan aktivitas dengan kata kunci "${searchQuery}". Coba gunakan kata kunci yang berbeda.`
                  : "Tidak ada aktivitas yang tersedia saat ini."}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => handleSearchChange("")}
                  variant="outline"
                  className="border-[#2BAE91] text-[#2BAE91] hover:bg-[#2BAE91] hover:text-white transition-colors duration-300"
                >
                  Hapus Pencarian
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        /* Pesan jika tidak ada hasil */
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center mx-8 mb-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak ada aktivitas ditemukan
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {searchQuery
              ? `Tidak ditemukan aktivitas dengan kata kunci "${searchQuery}". Coba gunakan kata kunci yang berbeda.`
              : "Tidak ada aktivitas yang tersedia saat ini."}
          </p>
        </div>
      )}

      <Footer />
    </>
  );
}
