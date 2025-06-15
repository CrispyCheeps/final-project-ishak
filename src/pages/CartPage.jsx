import React, { useState } from 'react';
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
  Gift
} from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "54c1f236-9d67-4609-b2f0-18e34d524487",
      userId: "7caee9cb-f3dc-418b-a367-dd7cd70ecfd9",
      activityId: "0a5ce7dd-334c-4eb1-b5d5-c73b56207d9a",
      quantity: 2,
      createdAt: "2025-06-11T15:11:37.306Z",
      updatedAt: "2025-06-11T15:12:04.857Z",
      activity: {
        imageUrls: [
          "https://www.arestravel.com/wp-content/uploads/seaworld-2-3.jpg"
        ],
        id: "0a5ce7dd-334c-4eb1-b5d5-c73b56207d9a",
        categoryId: "6afafacc-c5b4-4553-9323-925cb8bf76eb",
        title: "Sea World Ancol",
        description: "Explore the wonders of under the sea in the middle of busy Jakarta at the Sea World Ancol! As the name suggests, you can experience the beauty of life underwater with an enticing visit to this aquarium.",
        price: 100000,
        price_discount: 85000,
        rating: 4,
        total_reviews: 1320,
        facilities: "<p>Wheel chair</p>",
        address: "Taman Impian Jaya Ancol. Jl. Lodan timur No.7, RW.10, Ancol, Kec. Pademangan, Kota Jkt Utara, Daerah Khusus Ibukota Jakarta 14430, Indonesia",
        province: "North Jakarta",
        city: "Pademangan",
        location_maps: "<iframe src='https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3967.0362349768025!2d106.8428182!3d-6.125826300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMDcnMzMuMCJTIDEwNsKwNTAnMzQuMiJF!5e0!3m2!1sen!2sid!4v1679931691632!5m2!1sen!2sid' width='600' height='450' style='border:0;' allowfullscreen='' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>",
        createdAt: "2025-04-02T05:51:58.585Z",
        updatedAt: "2025-06-10T13:20:11.628Z"
      },
      // Additional UI fields for booking
      selectedDate: "2024-06-15",
      selectedTime: "10:00 AM"
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 1 && newQuantity <= 10) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setAppliedPromo({
        code: 'SAVE20',
        discount: 20,
        type: 'percentage'
      });
      setShowPromoInput(false);
      setPromoCode('');
    } else if (promoCode.toLowerCase() === 'welcome50') {
      setAppliedPromo({
        code: 'WELCOME50',
        discount: 50000,
        type: 'fixed'
      });
      setShowPromoInput(false);
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.activity.price_discount || item.activity.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateOriginalTotal = () => {
    return cartItems.reduce((total, item) => total + (item.activity.price * item.quantity), 0);
  };

  const calculatePromoDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {
      return Math.floor(subtotal * (appliedPromo.discount / 100));
    }
    return appliedPromo.discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculatePromoDiscount();
  };

  const totalSavings = calculateOriginalTotal() - calculateSubtotal() + calculatePromoDiscount();

  const formatLocation = (city, province) => {
    return `${city}, ${province}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold text-lg">My Cart</span>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium">{cartItems.length} items</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Start exploring amazing attractions and add them to your cart!</p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Attractions
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex space-x-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.activity.imageUrls[0]}
                          alt={item.activity.title}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-xs font-medium text-gray-700">Attraction</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.activity.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                              <MapPin className="h-4 w-4" />
                              <span>{formatLocation(item.activity.city, item.activity.province)}</span>
                            </div>
                            <div className="flex items-center space-x-1 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(item.activity.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">({item.activity.total_reviews})</span>
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
                              {item.selectedDate ? formatDate(item.selectedDate) : 'Select date'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{item.selectedTime || '10:00 AM'}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.activity.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">Quantity:</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <Minus className="h-3 w-3 text-gray-600" />
                              </button>
                              <span className="font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
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
                              {item.activity.price_discount && item.activity.price_discount < item.activity.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  Rp {(item.activity.price * item.quantity).toLocaleString()}
                                </span>
                              )}
                              <span className="text-lg font-bold text-teal-600">
                                Rp {((item.activity.price_discount || item.activity.price) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                            {item.activity.price_discount && item.activity.price_discount < item.activity.price && (
                              <div className="text-xs text-green-600 font-medium">
                                Save Rp {((item.activity.price - item.activity.price_discount) * item.quantity).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-gray-900">Promo Code</span>
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
                      <span className="font-medium text-green-800">{appliedPromo.code}</span>
                      <p className="text-sm text-green-600">
                        {appliedPromo.type === 'percentage' 
                          ? `${appliedPromo.discount}% discount applied` 
                          : `Rp ${appliedPromo.discount.toLocaleString()} discount applied`
                        }
                      </p>
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
                    onClick={() => {setShowPromoInput(false); setPromoCode('');}}
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
                      onClick={() => {setPromoCode('SAVE20'); setShowPromoInput(true);}}
                      className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow-100 transition-colors"
                    >
                      SAVE20 - 20% off
                    </button>
                    <button
                      onClick={() => {setPromoCode('WELCOME50'); setShowPromoInput(true);}}
                      className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      WELCOME50 - Rp 50.000 off
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} tickets)</span>
                  <span>Rp {calculateSubtotal().toLocaleString()}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span>-Rp {calculatePromoDiscount().toLocaleString()}</span>
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
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-teal-600">Rp {calculateTotal().toLocaleString()}</span>
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
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-lg font-semibold text-lg mt-6 transition-colors flex items-center justify-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;