import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/helpers/axios";
import { Button } from "../ui/button";

const PromoTable = () => {
  // Sample data sesuai dengan struktur yang diberikan
  const [dataPromo, setDataPromo] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form data states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });

  // Pagination calculations
  const totalItems = dataPromo.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dataPromo.slice(startIndex, endIndex);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
  };

  const handleOpenEditModal = (promo) => {
    setSelectedPromo(promo);
    setEditFormData({
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPromo(null);
  };

  const handleOpenPreview = (promo) => {
    setSelectedPromo(promo);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedPromo(null);
  };

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newpromo = {
        id: Date.now().toString(),
        ...formData,
        promo_discount_price: Number(formData.promo_discount_price),
        minimum_claim_price: Number(formData.minimum_claim_price),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDataPromo([newpromo, ...dataPromo]);
      setIsLoading(false);
      handleCloseModal();
    }, 1000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedpromos = dataPromo.map((promo) =>
        promo.id === selectedPromo.id
          ? {
              ...promo,
              ...editFormData,
              promo_discount_price: Number(editFormData.promo_discount_price),
              minimum_claim_price: Number(editFormData.minimum_claim_price),
              updatedAt: new Date().toISOString(),
            }
          : promo
      );
      setDataPromo(updatedpromos);
      setIsLoading(false);
      handleCloseEditModal();
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus promo ini?")) {
      setDataPromo(dataPromo.filter((promo) => promo.id !== id));
    }
  };

  // Pagination handlers
  const goToPage = (page) => setCurrentPage(page);
  const goToNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const fetchPromos = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/promos", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      });
      setDataPromo(res.data.data);
    } catch (error) {
      console.error("Error fetching promos:", error);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Management</h1>
          <p className="text-gray-600 mt-1">
            Kelola promo promo yang ditampilkan di aplikasi
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Tambah Promo promo
        </button>
      </div>

      {/* Table Container - Pastikan ini yang mengatur scroll */}
      <div className="w-full sm:w-[600px] md:w-[800px] lg:w-[1100px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Wrapper untuk scroll horizontal - KUNCI UTAMA */}
        <div className="overflow-x-auto">
          {/* Table dengan min-width yang lebih besar dari container */}
          <table className="w-full">
            {" "}
            {/* Perbesar min-width jika perlu */}
            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  No
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Preview
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Judul Promo
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Kode Promo
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Diskon
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Min. Pembelian
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Dibuat
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((promo, index) => (
                <tr
                  key={promo.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 min-w-[200px]">
                    {" "}
                    {/* Set min-width untuk kolom yang perlu lebih lebar */}
                    <div className="font-medium text-gray-900">
                      {promo.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {promo.description}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {promo.promo_code}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {formatCurrency(promo.promo_discount_price)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatCurrency(promo.minimum_claim_price)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(promo.createdAt)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenPreview(promo)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(promo)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit promo"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus promo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} banners
            </div>
            <div className="flex items-center gap-4">
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    // Show current page, first page, last page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage && page === currentPage - 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    if (!showPage && page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    if (!showPage) return null;

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Tambah Promo Baru
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Judul Promo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Promo *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul promo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi promo"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* URL Gambar */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Gambar *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/gambar.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Kode Promo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Promo *
                  </label>
                  <input
                    type="text"
                    name="promo_code"
                    value={formData.promo_code}
                    onChange={handleInputChange}
                    placeholder="PROMO123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Jumlah Diskon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Diskon (Rp) *
                  </label>
                  <input
                    type="number"
                    name="promo_discount_price"
                    value={formData.promo_discount_price}
                    onChange={handleInputChange}
                    placeholder="100000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Minimum Pembelian */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Pembelian (Rp) *
                  </label>
                  <input
                    type="number"
                    name="minimum_claim_price"
                    value={formData.minimum_claim_price}
                    onChange={handleInputChange}
                    placeholder="500000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Syarat & Ketentuan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Syarat & Ketentuan *
                  </label>
                  <textarea
                    name="terms_condition"
                    value={formData.terms_condition}
                    onChange={handleInputChange}
                    placeholder="Masukkan syarat dan ketentuan promo"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview Gambar
                    </label>
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                        <div className="text-center">
                          <p className="text-sm">Gambar tidak dapat dimuat</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Promo promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoTable;
