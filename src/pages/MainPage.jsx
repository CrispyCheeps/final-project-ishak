import Navbar from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Icon,
  MapPin,
  Search,
  X,
  Copy,
  Check,
  Gift,
  Calendar,
  Users,
  Tag,
  Percent,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { act, use, useEffect, useState } from "react";
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
import ActivityCard from "@/components/ActivityCard";
import CategoryCard from "@/components/CategoryCard";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const [dataPromo, setDataPromo] = useState([]);
  const dispatch = useDispatch();
  const { promos, loadingPromo, error } = useSelector((state) => state.promos);
  const { menu } = useSelector((state) => state.menu);
  const [showNavbar, setShowNavbar] = useState(true);
  const [itemToShow, setItemToShow] = useState(3);
  const [showAllItems, setShowAllItems] = useState(false);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const displayedPromos = showAllItems ? promos : promos.slice(0, itemToShow);
  const displayedActivities = showAllItems
    ? activities
    : activities.slice(0, itemToShow);
  const displayedCategories = showAllItems
    ? categories
    : categories.slice(0, itemToShow);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getActivities = () => {
    setLoadingPromo(true);
    axios
      .get("/api/v1/activities", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        console.log(res.data);
        setLoadingPromo(false);
        if (res.data.code == "200") {
          setActivities(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => {
        setLoadingPromo(false);
      });
  };

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

  const openTicket = (promo) => {
    setSelectedPromo(promo);
  };

  const closeTicket = () => {
    setSelectedPromo(null);
    setCopiedCode("");
  };

  useEffect(() => {
    dispatch(getPromos());
    getActivities();
    getCategories();
  }, [dispatch]);

  const handleShowMore = () => {
    if (showAllItems) {
      // Kembali ke tampilan awal
      setShowAllItems(false);
      setItemToShow(3);
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
      // Cek apakah dengan menambah 8 item akan melebihi total
      if (itemToShow + 3 >= promos.length) {
        setShowAllItems(true);
      } else {
        setItemToShow((prev) => prev + 3);
      }
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <Navbar show={showNavbar} />
      <section className="my-12 flex items-center justify-center">
        <div className="relative w-full h-[420px] bg-[url('https://ik.imagekit.io/tvlk/image/imageResource/2025/01/05/1736039117166-e16913199b4e62397ea8435ddd83b811.png?tr=dpr-2,q-75')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Tripantara</h1>
            <p className="mb-8 font-sans">
              Temukan keajaiban tersembunyi dengan Tripantara
            </p>
            {menu === "promos" && (
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {/* Dropdown - bisa pakai shadcn Popover + Button */}
                <Button
                  onClick={() => navigate("/categories")}
                  className="rounded-full bg-white text-[#2BAE91] px-6 py-2 hover:bg-gray-100"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Lihat destinasi
                  <ChevronDown className="ml-2 w-4 h-4" />
                </Button>

                {/* Search */}
                <div className="flex bg-white rounded-full items-center px-4 py-2 shadow-lg w-full max-w-md">
                  <Search className="text-gray-400 w-4 h-4 mr-2" />
                  <input
                    placeholder="Cari destinasi atau aktivitas"
                    className="w-full outline-none text-gray-700"
                    disabled
                  />
                  <Button
                    onClick={() => navigate("/activities")}
                    className="ml-2 rounded-full bg-[#2BAE91] hover:bg-[#329AC0] text-white px-6"
                  >
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
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2BAE91] border-t-transparent"></div>
              <h1 className="text-xl font-semibold text-gray-700">
                Loading Promo...
              </h1>
            </div>
          </div>
        ) : (
          <>
            <div className="w-[240px] mx-8 my-8 h-[50px] rounded-xl bg-gradient-to-r from-[#2BAE91] to-[#329AC0] text-white flex items-center justify-center">
              <img
                src="images/icon-announcement.png"
                alt="Announcement"
                className="w-6 h-6"
              />
              <span className="text-xl font-semibold">Promo Special</span>
            </div>
            {promos.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-4 mx-8 mb-30">
                  {displayedPromos.map((promo) => (
                    <PromoCard
                      key={promo.id}
                      title={promo.title}
                      imageUrl={promo.imageUrl}
                      openTicket={() => openTicket(promo)}
                    />
                  ))}
                </div>
                {/* Tombol Lihat Selengkapnya */}
                {promos.length > 3 && (
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
                          {promos.length - displayedPromos.length} lainnya)
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
                  Tidak ada promo ditemukan
                </h3>
              </div>
            )}
          </>
        )}
      </div>

      {/* Ticket Popup Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-start justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-md max-h-[90vh] my-auto w-full animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeTicket}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Ticket Design */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-y-auto">
              {/* Ticket Header */}
              <div className="relative bg-[#2BAE91] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Gift className="w-6 h-6 mr-2" />
                    <span className="font-bold text-lg">PROMO TICKET</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium">
                    <p className="text-black">AKTIF</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">
                  {selectedPromo.title}
                </h2>
                <p className="text-blue-100 text-sm">
                  {selectedPromo.description}
                </p>

                {/* Perforated Edge */}
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-white rounded-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-6 pt-8">
                {/* Promo Code Section */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded-full mb-3">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">KODE PROMO</span>
                  </div>

                  <div className="relative">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 mb-3">
                      <div className="text-3xl font-bold text-gray-800 tracking-wider font-mono">
                        {selectedPromo.promo_code}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(selectedPromo.promo_code)}
                      className="w-full bg-[#2BAE91] hover:bg-green-900 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                    >
                      {copiedCode === selectedPromo.promo_code ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Berhasil Disalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Salin Kode Promo
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Promo Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Diskon</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(selectedPromo.promo_discount_price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 text-sm">
                      Min. Pembelian
                    </span>
                    <span className="font-bold text-[#2BAE91]">
                      {formatCurrency(selectedPromo.minimum_claim_price)}
                    </span>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Syarat & Ketentuan
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 overflow-y-auto max-h-full">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedPromo.terms_condition.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                </div>

                {/* Ticket Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Valid hingga kedaluwarsa</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>ID: {selectedPromo.id.slice(-8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {copiedCode && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Kode promo berhasil disalin ke clipboard!
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Activities */}
      <div className="border-t border-gray-200">
        <div className="activities-header w-[200px] mx-8 my-8 h-[50px] rounded-xl bg-gradient-to-r from-[#2BAE91] to-[#329AC0] text-white flex items-center justify-center">
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


            {/* Grid Activities */}
            {activities.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-4 mx-8 mb-30">
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
                {activities.length > 3 && (
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
                          {activities.length - displayedActivities.length}{" "}
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
              </div>
            )}
      </div>

      <div className="border-t border-gray-200">
        <div className="activities-header w-[200px] mx-8 my-8 h-[50px] rounded-xl bg-gradient-to-r from-[#2BAE91] to-[#329AC0] text-white flex items-center justify-center ">
          <span className="text-2xl font-semibold">Category</span>
        </div>
      </div>

      {
        categories.length > 0 ? (
          <div className="flex flex-wrap gap-4 mx-8 mb-30">
            {displayedCategories.map((category) => (
              <CategoryCard
                id={category.id}
                imageUrl={category.imageUrl}
                name={category.name}
              />
            ))}
          </div>
        ) : (
          /* Pesan jika tidak ada hasil */
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center mx-8 mb-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada kategori ditemukan
            </h3>
          </div>
        )
      }
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
