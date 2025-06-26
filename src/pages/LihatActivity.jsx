import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Star, Accessibility } from "lucide-react";
import axios from "@/helpers/axios";

export default function LihatActivity() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activity, setActivity] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [loading, setLoading] = useState(true);
  const lastScrollY = useRef(0);

  const fetchActivity = useCallback(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/api/v1/activity/${id}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        if (res.data.code === "200") {
          setActivity(res.data.data);
        } else {
          console.error("Failed to fetch activity data:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching activity:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY.current;

    if (scrollingDown !== !showNavbar) {
      setShowNavbar(!scrollingDown);
    }

    lastScrollY.current = currentScrollY;
  }, [showNavbar]);

  useEffect(() => {
    setShowNavbar(true);
    fetchActivity();
  }, [fetchActivity]);

  useEffect(() => {
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [handleScroll]);

  const navigate = useNavigate();

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to add items to your cart.");
      navigate("/");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/add-cart",
        {
          activityId: id,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Item added to cart:", response.data);
      alert("Item successfully added to your cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to add item to cart. Please try again."
      );
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const discountPercentage = activity?.price_discount
    ? Math.round(
        ((activity.price_discount - activity.price) / activity.price_discount) *
          100
      )
    : 0;

  const mapSrc =
    typeof activity?.location_maps === "string"
      ? activity.location_maps.match(/src=['"]([^'"]*)['"]/i)?.[1] || ""
      : "";

  if (loading || !activity) {
    return (
      <>
        <Navbar show={showNavbar} />
        <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
          <div className="flex justify-center items-center h-64">
            {loading ? (
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-lg">Activity not found</p>
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar show={showNavbar} />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-96">
                <img
                  src={activity.imageUrls?.[selectedImage]}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {activity.imageUrls?.slice(0, 6).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full ${
                        selectedImage === index ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {activity.category.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {activity.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < activity.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-lg font-semibold text-gray-900">
                    {activity.rating}
                  </span>
                </div>
                <span className="text-gray-600">
                  {activity.total_reviews > 0
                    ? `(${activity.total_reviews.toLocaleString()} reviews)`
                    : "No reviews yet"}
                </span>
              </div>
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    {activity.city}, {activity.province}
                  </p>
                  <p className="text-sm">{activity.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Activity
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {showFullDescription
                  ? activity.description
                  : `${activity.description.substring(0, 200)}...`}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Facilities
              </h2>
              <div className="flex items-center space-x-2">
                <Accessibility size={20} className="text-green-600" />
                <span className="text-gray-700">{activity.facilities}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                {mapSrc ? (
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                ) : (
                  <div className="text-center">
                    <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">
                      Click to view on Google Maps
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(activity.price)}
                  </span>
                  <span className="text-sm text-gray-500">per person</span>
                </div>
                {activity.price_discount && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(activity.price_discount)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Save{" "}
                      {formatPrice(activity.price_discount - activity.price)}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#2BAE91] text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
