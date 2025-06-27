import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "@/helpers/axios";
import { Button } from "../ui/button";
import axiosInstance from "@/helpers/axios";
import { useNavigate } from "react-router-dom";

const BannerTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);

  const fetchDataBanners = () => {
    axios
      .get("/api/v1/banners", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        setDataBanner(res.data.data);
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    fetchDataBanners();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormData({ name: "", imageUrl: "" });
    setImagePreview(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", imageUrl: "" });
    setImagePreview(null);
  };

  const handleOpenEditModal = (banner) => {
    setSelectedBanner(banner);
    setEditFormData({
      id: banner.id,
      name: banner.name,
      imageUrl: banner.imageUrl,
    });
    setEditImagePreview(banner.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBanner(null);
    setEditFormData({ id: "", name: "", imageUrl: "" });
    setEditImagePreview(null);
  };

  const handleOpenPreview = (banner) => {
    setSelectedBanner(banner);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nama banner harus diisi.");
      return;
    }

    if (!formData.imageUrl) {
      alert("URL banner harus dimasukkan.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        "/api/v1/banners",
        {
          name: formData.name,
          imageUrl: formData.imageUrl,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Banner berhasil ditambahkan!");
      handleCloseModal();
    } catch (error) {
      console.error("Error creating banner:", err);
      alert("Gagal menambahkan banner. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.name.trim()) {
      alert("Nama banner harus diisi.");
      return;
    }

    setIsLoading(true);

    try {

      const res = await axiosInstance.post(
        `/api/v1/update-banner/${editFormData.id}`, // Ganti sesuai dengan field ID-nya
        {
          name: editFormData.name,
          imageUrl: editFormData.imageUrl,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Banner berhasil diperbarui!");
      handleCloseEditModal();
      fetchDataBanners(); // Refresh data after update
    } catch (err) {
      console.error("Error updating banner:", err);
      alert("Gagal memperbarui banner. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    try {
      const res = await axiosInstance.delete(
        `/api/v1/delete-banner/${bannerId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        alert("Banner berhasil dihapus!");
        fetchDataBanners();
      }
    } catch {
      alert("Gagal menghapus banner. Silakan coba lagi.");
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalItems = dataBanner.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dataBanner.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Banner Management
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola banner yang ditampilkan di aplikasi
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Tambah Banner
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  No
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Preview
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Nama Banner
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Dibuat
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Diperbarui
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((banner, index) => (
                <tr
                  key={banner.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Nomor */}
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                    {index + 1}
                  </td>

                  {/* Preview Image */}
                  <td className="py-4 px-4">
                    <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={banner.imageUrl}
                        alt={banner.name}
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

                  {/* Nama Banner */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {banner.name}
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate max-w-xs"
                      title={banner.imageUrl}
                    >
                      {banner.imageUrl}
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(banner.createdAt)}
                  </td>

                  {/* Updated At */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(banner.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleOpenPreview(banner)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(banner)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Banner"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Banner"
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

        {/* Empty State */}
        {dataBanner.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada banner
            </h3>
            <p className="text-gray-500 mb-4">
              Mulai dengan menambahkan banner pertama Anda
            </p>
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Tambah Banner
            </button>
          </div>
        )}
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

      {/* Modal Tambah Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Tambah Banner Baru
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Nama Banner */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Banner *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama banner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* URL Gambar */}
              <div className="mb-6">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL Gambar Banner *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/gambar.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan URL gambar yang valid (PNG, JPG, JPEG)
                </p>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="mb-6">
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="Preview Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      onLoad={(e) => {
                        e.target.style.display = "block";
                        e.target.nextSibling.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Gambar tidak dapat dimuat</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                  {isLoading ? "Menyimpan..." : "Simpan Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Banner */}
      {isEditModalOpen && selectedBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Banner
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6">
              {/* Nama Banner */}
              <div className="mb-6">
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Banner *
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  placeholder="Masukkan nama banner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* URL Gambar Banner */}
              <div className="mb-6">
                <label
                  htmlFor="edit-imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL Gambar Banner *
                </label>
                <input
                  type="url"
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={editFormData.imageUrl || ""}
                  onChange={handleEditInputChange}
                  placeholder="https://example.com/gambar.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan URL gambar yang valid (PNG, JPG, JPEG)
                </p>
              </div>

              {/* Image Preview */}
              {editFormData.imageUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Gambar
                  </label>
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={editFormData.imageUrl}
                      alt="Preview Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      onLoad={(e) => {
                        e.target.style.display = "block";
                        e.target.nextSibling.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Gambar tidak dapat dimuat</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* URL Info Lama */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Gambar Sebelumnya
                </label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 break-all">
                    {selectedBanner.imageUrl}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Menyimpan..." : "Perbarui Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Banner */}
      {isPreviewModalOpen && selectedBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Preview Banner
              </h2>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Gambar Banner
                  </h3>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedBanner.imageUrl}
                      alt={selectedBanner.name}
                      className="w-full h-auto max-h-80 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="w-full h-80 hidden items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto mb-2" />
                        <p>Gambar tidak dapat dimuat</p>
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      URL Gambar:
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      {selectedBanner.imageUrl}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedBanner.imageUrl);
                        alert("URL berhasil disalin!");
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Salin URL
                    </button>
                  </div>
                </div>

                {/* Banner Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detail Banner
                  </h3>

                  {/* Banner Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Nama Banner
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {selectedBanner.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Tanggal Dibuat
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(selectedBanner.createdAt)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Terakhir Diperbarui
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(selectedBanner.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Banner */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm font-medium text-green-800">
                          Status: Banner Aktif
                        </p>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        Banner ini sedang ditampilkan di aplikasi
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Aksi Cepat
                      </h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            handleClosePreview();
                            handleOpenEditModal(selectedBanner);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          <Edit size={16} className="inline mr-2" />
                          Edit Banner
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                          <Trash2 size={16} className="inline mr-2" />
                          Hapus Banner
                        </button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Informasi Tambahan
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Banner ini dapat dilihat oleh semua pengguna</li>
                        <li>• Ukuran gambar optimal: 1920x1080 piksel</li>
                        <li>• Format yang didukung: JPG, PNG, JPEG</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleClosePreview();
                  handleOpenEditModal(selectedBanner);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerTable;
