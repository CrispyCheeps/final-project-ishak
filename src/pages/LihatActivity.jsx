import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { useParams } from "react-router-dom";
import React, { use, useEffect, useRef, useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Wifi,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Accessibility,
} from "lucide-react";
import axios from "@/helpers/axios";

export default function LihatActivity() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activity, setActivity] = useState();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  const fetchActivity = () => {
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
      });
  };

  useEffect(() => {
    fetchActivity();
  }, []);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  let discountPercentage = 0;
  if (activity && activity.price_discount) {
    discountPercentage = Math.round(
      ((activity.price_discount - activity.price) / activity.price_discount) *
        100
    );
  }

  let mapSrc = "";
  if (typeof activity?.location_maps === "string") {
    const match = activity.location_maps.match(/src=['"]([^'"]*)['"]/);
  }

  console.log("Activity:", mapSrc);

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       const currentScrollY = window.scrollY;

  //       if (currentScrollY > lastScrollY) {
  //         // Scroll down
  //         setShowNavbar(false);
  //       } else {
  //         // Scroll up
  //         setShowNavbar(true);
  //       }

  //       setLastScrollY(currentScrollY);
  //     };

  //     window.addEventListener("scroll", handleScroll);

  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, [lastScrollY]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY; // ← TIDAK trigger re-render!
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!activity) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Loading activity...</p>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-96">
                <img
                  src={activity.imageUrls[selectedImage]}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage ?? "0"}% OFF
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {activity.imageUrls.map((_, index) => (
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

            {/* Title and Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {activity.category.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {activity.title}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < activity.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-lg font-semibold text-gray-900">
                    {activity.rating}
                  </span>
                </div>
                {activity.total_reviews > 0 ? (
                  <span className="text-gray-600">
                    ({activity.total_reviews.toLocaleString()} reviews)
                  </span>
                ) : (
                  <span className="text-gray-600">No reviews yet</span>
                )}
              </div>

              {/* Location */}
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

            {/* Description */}
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

            {/* Facilities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Facilities
              </h2>
              <div className="flex items-center space-x-2">
                <Accessibility size={20} className="text-green-600" />
                <span className="text-gray-700">{activity.facilities}</span>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                {mapSrc ? (
                  <div className="w-full h-64 overflow-hidden rounded-lg">
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
                  </div>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
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

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar
                    size={20}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center space-x-4">
                  <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    -
                  </button>
                  <span className="text-lg font-medium">2</span>
                  <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    +
                  </button>
                </div>
              </div>

              {/* Book Button */}
              <button className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors mb-4">
                Book Now
              </button>

              <button className="w-full border border-gray-300 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors">
                Add to Wishlist
              </button>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Instant Confirmation</span>
                    <span className="text-green-600 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Free Cancellation</span>
                    <span className="text-green-600 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mobile Ticket</span>
                    <span className="text-green-600 font-medium">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Guest Reviews
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {activity.rating}
                </div>
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < activity.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {activity.total_reviews > 0 ? (
                    <p className="text-sm text-gray-600">
                      {activity.total_reviews.toLocaleString()} reviews
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">No reviews yet</p>
                  )}
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Read all reviews →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
