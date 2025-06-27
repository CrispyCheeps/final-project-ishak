import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Shield,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axios";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axiosInstance.get("/api/v1/carts", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.code === "200") {
        // Pastikan data adalah array
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setCartItems(data);
      } else {
        throw new Error(res.data.message || "Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error.message);
      setCartItems([]); // Set ke array kosong jika error
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.get("/api/v1/payment-methods", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.code === "200") {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchPaymentMethods();
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const navigate = useNavigate();

  const updateQuantity = async (id, change) => {
    try {
      const item = cartItems.find((item) => item.id === id);
      if (!item) return;

      const newQuantity = item.quantity + change;

      // Validasi quantity agar tidak <1 atau >10
      if (newQuantity < 1 || newQuantity > 10) return;

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axiosInstance.post(
        `/api/v1/update-cart/${id}`,
        { quantity: newQuantity },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.code === "200") {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      // Tampilkan error ke user atau handle dengan cara lain
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/v1/delete-cart/${id}`, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.code === "200") {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setAppliedPromo({ code: promoCode.trim() });
      setShowPromoInput(false);
      setPromoCode("");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Tambahkan null check untuk activity
      if (!item.activity) return total;

      const price = item.activity.price_discount || item.activity.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const calculateOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      // Tambahkan null check untuk activity
      if (!item.activity) return total;

      return total + (item.activity.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const totalSavings = calculateOriginalTotal() - calculateSubtotal();

  const formatLocation = (city, province) => {
    if (!city && !province) return "Location not specified";
    if (!city) return province;
    if (!province) return city;
    return `${city}, ${province}`;
  };

  const proceedToCheckout = async () => {
    if (!selectedPaymentMethod) {
      setShowPaymentMethods(true);
      return;
    }

    try {
      setIsCheckingOut(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const cartIds = cartItems.map((item) => item.id);
      const requestBody = {
        cartIds: cartIds,
        paymentMethodId: selectedPaymentMethod.id,
      };

      const res = await axiosInstance.post(
        "/api/v1/create-transaction",
        requestBody,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      if (res.data.code === "200") {
        navigate("/purchased");
      } else {
        throw new Error(res.data.message || "Failed to create transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not selected";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading cart
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCartItems}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold text-lg">My Cart</span>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium">
              {cartItems.length} items
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring amazing attractions and add them to your cart!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Attractions
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                // Null check untuk item dan activity
                if (!item || !item.activity) {
                  return null;
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              item.activity.imageUrls?.[0] ||
                              "/placeholder-image.jpg"
                            }
                            alt={item.activity.title || "Activity"}
                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-xs font-medium text-gray-700">
                              Attraction
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {item.activity.title || "Untitled Activity"}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {formatLocation(
                                    item.activity.city,
                                    item.activity.province
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i <
                                        Math.floor(item.activity.rating || 0)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({item.activity.total_reviews || 0})
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {formatDate(item.selectedDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {item.selectedTime || "10:00 AM"}
                              </span>
                            </div>
                          </div>

                          {item.activity.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {item.activity.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Quantity:
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                  <Minus className="h-3 w-3 text-gray-600" />
                                </button>
                                <span className="font-medium min-w-[1.5rem] text-center">
                                  {item.quantity || 1}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                  <Plus className="h-3 w-3 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                {item.activity.price_discount > 0 &&
                                  item.activity.price_discount <
                                    item.activity.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      Rp{" "}
                                      {(
                                        (item.activity.price || 0) *
                                        (item.quantity || 1)
                                      ).toLocaleString()}
                                    </span>
                                  )}

                                <span className="text-lg font-bold text-teal-600">
                                  Rp{" "}
                                  {(
                                    (item.activity.price_discount &&
                                    item.activity.price_discount > 0 &&
                                    item.activity.price_discount <
                                      item.activity.price
                                      ? item.activity.price_discount
                                      : item.activity.price || 0) *
                                    (item.quantity || 1)
                                  ).toLocaleString()}
                                </span>
                              </div>

                              {item.activity.price_discount > 0 &&
                                item.activity.price_discount <
                                  item.activity.price && (
                                  <div className="text-xs text-green-600 font-medium">
                                    Save Rp{" "}
                                    {(
                                      ((item.activity.price || 0) -
                                        (item.activity.price_discount || 0)) *
                                      (item.quantity || 1)
                                    ).toLocaleString()}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-gray-900">
                    Promo Code
                  </span>
                </div>
                {!showPromoInput && !appliedPromo && (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                  >
                    Add Code
                  </button>
                )}
              </div>

              {appliedPromo ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="font-medium text-green-800">
                        {appliedPromo.code}
                      </span>
                      <p className="text-sm text-green-600">discount applied</p>
                    </div>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : showPromoInput ? (
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setShowPromoInput(false);
                      setPromoCode("");
                    }}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Have a promo code? Click "Add Code" to apply it.
                </div>
              )}

              {/* Suggested Promo Codes */}
              {!appliedPromo && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Try these codes:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setPromoCode("SAVE20");
                        setShowPromoInput(true);
                      }}
                      className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow-100 transition-colors"
                    >
                      SAVE20 - 20% off
                    </button>
                    <button
                      onClick={() => {
                        setPromoCode("WELCOME50");
                        setShowPromoInput(true);
                      }}
                      className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      WELCOME50 - Rp 50.000 off
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            {showPaymentMethods && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Select Payment Method
                  </h3>
                  <button
                    onClick={() => setShowPaymentMethods(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => {
                        setSelectedPaymentMethod(method);
                        setShowPaymentMethods(false);
                      }}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedPaymentMethod?.id === method.id
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={method.imageUrl}
                          alt={method.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {method.name}
                          </span>
                        </div>
                        {selectedPaymentMethod?.id === method.id && (
                          <CheckCircle className="h-5 w-5 text-teal-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethods.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No payment methods available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Payment Method Display */}
            {selectedPaymentMethod && !showPaymentMethods && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Payment Method
                  </h3>
                  <button
                    onClick={() => setShowPaymentMethods(true)}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="border border-teal-200 bg-teal-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedPaymentMethod.imageUrl}
                      alt={selectedPaymentMethod.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {selectedPaymentMethod.name}
                      </span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal (
                    {cartItems.reduce(
                      (sum, item) => sum + (item.quantity || 1),
                      0
                    )}{" "}
                    tickets)
                  </span>
                  <span>Rp {calculateSubtotal().toLocaleString()}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span>Applied</span>
                  </div>
                )}

                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-Rp {totalSavings.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      Rp {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span>Mobile tickets - no printing required</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                disabled={isCheckingOut}
                className={`w-full py-4 rounded-lg font-semibold text-lg mt-6 transition-colors flex items-center justify-center space-x-2 ${
                  isCheckingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                } text-white`}
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : selectedPaymentMethod ? (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with {selectedPaymentMethod.name}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Select Payment Method</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
