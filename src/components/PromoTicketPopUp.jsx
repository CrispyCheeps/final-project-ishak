import React, { useState } from 'react';
import { X, Copy, Check, Gift, Calendar, Users, MapPin, Tag, Percent } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PromoTicketPopup = () => {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  // Data promo dari JSON
  const promoData = [
    {
      "id": "a5751fd7-2236-4059-b90c-8b93dfcdd4df",
      "title": "Promo DUFAN Ulang LAGI",
      "description": "Bagi yang ulang tahun",
      "imageUrl": "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2021/12/08/9c6ae660-1799-4276-b81d-f8b0b85669d6-1638949473006-1e6c55a1b1edca6bf250012af2cc79e2.jpg",
      "terms_condition": "Tanggal lahir sesuai dengan tanggal masuk",
      "promo_code": "qwertyy1",
      "promo_discount_price": 400000,
      "minimum_claim_price": 10,
      "createdAt": "2025-05-09T12:31:46.223Z",
      "updatedAt": "2025-06-14T06:34:58.676Z"
    },
    {
      "id": "baf86963-7a81-4573-925f-3fe990088f50",
      "title": "Promo Manula",
      "description": "Untuk yang diatas 60 tahun",
      "imageUrl": "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2021/12/08/9c6ae660-1799-4276-b81d-f8b0b85669d6-1638949473006-1e6c55a1b1edca6bf250012af2cc79e2.jpg",
      "terms_condition": "Umur di ktp diatas 60 tahun",
      "promo_code": "manula60",
      "promo_discount_price": 100000,
      "minimum_claim_price": 100000,
      "createdAt": "2025-06-14T06:36:33.218Z",
      "updatedAt": "2025-06-14T06:36:33.218Z"
    },
    {
      "id": "75054c2d-d636-42eb-940a-3762218b412c",
      "title": "Staycation Brings Silaturahmi 🙏",
      "description": "Friendly reminder, family staycation shall be forever memorable ✨ Book staycation now with discount up to Rp1 mio for Hotels, Villas & Resorts to celebrate Ramadan moments with your loved ones",
      "imageUrl": "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2021/12/08/9c6ae660-1799-4276-b81d-f8b0b85669d6-1638949473006-1e6c55a1b1edca6bf250012af2cc79e2.jpg",
      "terms_condition": "Discount coupon of 15% (maximum value of IDR 150,000) with a minimum transaction of IDR 50,000 in one booking code.",
      "promo_code": "BELI2",
      "promo_discount_price": 100000,
      "minimum_claim_price": 300000,
      "createdAt": "2025-05-26T06:19:23.458Z",
      "updatedAt": "2025-06-14T06:37:05.182Z"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openTicket = (promo) => {
    setSelectedPromo(promo);
  };

  const closeTicket = () => {
    setSelectedPromo(null);
    setCopiedCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🎫 Promo Tickets</h1>
        <p className="text-gray-600">Klik tiket untuk melihat kode promo</p>
      </div>

      {/* Promo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
        {promoData.map((promo) => (
          <div
            key={promo.id}
            onClick={() => openTicket(promo)}
            className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden group"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {promo.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {promo.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <Percent className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{formatCurrency(promo.promo_discount_price)}</span>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Lihat Kode
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Popup Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="relative max-w-md w-full animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeTicket}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Ticket Design */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Ticket Header */}
              <div className="relative bg-blue-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Gift className="w-6 h-6 mr-2" />
                    <span className="font-bold text-lg">PROMO TICKET</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium">
                    AKTIF
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-2">{selectedPromo.title}</h2>
                <p className="text-blue-100 text-sm">{selectedPromo.description}</p>
                
                {/* Perforated Edge */}
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
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
                    <span className="text-gray-600 text-sm">Min. Pembelian</span>
                    <span className="font-bold text-blue-600">
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
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedPromo.terms_condition.replace(/<[^>]*>/g, '')}
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
    </div>
  );
};

export default PromoTicketPopup;