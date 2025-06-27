import React, { useState, useEffect } from "react";
import {
  Calendar,
  CreditCard,
  Package,
  Clock,
  AlertCircle,
  Upload,
  X,
  Link2,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "@/helpers/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const MyPurchase = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const upload = searchParams.get("upload");

  const [isOpen, setIsOpen] = useState(false);
  const [proofPaymentUrl, setProofPaymentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  };
  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      setProofPaymentUrl("");
      setError("");
      setIsSuccess(false);
    }
    const params = new URLSearchParams(location.search);
    params.delete("upload");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSubmit = async () => {
    setError("");

    if (!proofPaymentUrl.trim()) {
      setError("URL bukti pembayaran wajib diisi");
      return;
    }

    if (!validateUrl(proofPaymentUrl)) {
      setError(
        "Format URL tidak valid. Pastikan URL dimulai dengan http:// atau https://"
      );
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        proofPaymentUrl,
      };

      const response = await axiosInstance.post(
        `/api/v1/update-transaction-proof-payment/${upload}`,
        requestBody,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === "200") {
        setIsSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
        window.location.reload();
      } else {
        throw new Error(
          response.data.message || "Gagal mengirim bukti pembayaran"
        );
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengirim data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading && proofPaymentUrl.trim()) {
      handleSubmit();
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  useEffect(() => {
    if (upload) {
      setIsOpen(true);
    }
  }, [upload]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axiosInstance.get("/api/v1/my-transactions", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.code === "200") {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setTransactions(data);
      } else {
        throw new Error(res.data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isExpired = (expiredDate) => {
    return new Date(expiredDate) < new Date();
  };

  const handleUploadProofPayment = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axiosInstance.post(
        `/api/v1/update-transaction-proof-payment/${id}`,
        {
          proofPaymentUrl: "https://example.com/proof_payment.jpg",
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error uploading proof payment:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat transaksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  const handleOpenUpload = (id) => {
    const params = new URLSearchParams(location.search);
    params.set("upload", id); // ganti atau tambahkan query param upload
    navigate(`${location.pathname}?${params.toString()}`);
    setIsOpen(true);
  };

  return (
    <>
      <Navbar show={showNavbar} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mt-24 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Transaksi Saya</h1>
            <p className="text-gray-600 mt-2">
              Kelola dan pantau semua transaksi Anda
            </p>
          </div>

          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Header Transaksi */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.invoiceId}
                        </p>
                        <p className="text-sm text-gray-500">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {formatDate(transaction.orderDate)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.toUpperCase()}
                      </span>
                      {isExpired(transaction.expiredDate) && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <Clock className="inline h-3 w-3 mr-1" />
                          EXPIRED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detail Transaksi */}
                <div className="p-6">
                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {transaction.transaction_items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64x64?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-sm">
                              <span className="text-gray-500">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <div className="text-right">
                              {item.price_discount > 0 && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatCurrency(item.price_discount)}
                                </p>
                              )}
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method & Total */}
                  <div className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.payment_method.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.payment_method.virtual_account_number}
                          </p>
                          <p className="text-sm text-gray-500">
                            a/n{" "}
                            {transaction.payment_method.virtual_account_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Total Pembayaran
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(transaction.totalAmount)}
                        </p>
                        <p className="text-sm text-red-600">
                          Batas: {formatDate(transaction.expiredDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {transaction.status === "pending" &&
                    !isExpired(transaction.expiredDate) && (
                      <div className="mt-6 flex justify-end flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {transaction.proofPaymentUrl ? (
                          <>
                            <a
                              href={transaction.proofPaymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#329AC0] text-center text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Lihat Bukti Pembayaran
                            </a>
                            <button
                              onClick={() => handleOpenUpload(transaction.id)}
                              className="bg-[#2BAE91] text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Perbarui Bukti Pembayaran
                            </button>
                          </>
                        ) : (
                          <button
                            // onClick={() =>
                            //   handleUploadProofPayment(transaction.id)
                            // }
                            onClick={() => handleOpenUpload(transaction.id)}
                            className="bg-[#2BAE91] text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Upload Bukti Pembayaran
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada transaksi</p>
              <p className="text-gray-400">
                Transaksi Anda akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform animate-in zoom-in-95 duration-300 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Upload Bukti Pembayaran
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Masukkan link bukti pembayaran Anda
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Berhasil Dikirim!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Bukti pembayaran Anda telah berhasil diupload dan akan
                    diverifikasi segera
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-700">
                      URL Bukti Pembayaran{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Link2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={proofPaymentUrl}
                        onChange={(e) => {
                          setProofPaymentUrl(e.target.value);
                          setError("");
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="https://drive.google.com/file/..."
                        className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg placeholder-gray-400"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-sm text-gray-500 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      Masukkan link bukti pembayaran dari Google Drive, Dropbox,
                      atau platform lainnya
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <div>
                        <p className="text-blue-800 font-semibold mb-1">
                          Tips Upload:
                        </p>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Pastikan link dapat diakses publik</li>
                          <li>• Format yang didukung: JPG, PNG, PDF</li>
                          <li>• Pastikan bukti pembayaran terlihat jelas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {!isSuccess && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !proofPaymentUrl.trim()}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Kirim Bukti
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyPurchase;
