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
  Star,
  MapPin,
  Save,
  Plus,
  Loader2,
} from "lucide-react";
import axios from "@/helpers/axios";
import { Button } from "../ui/button";
import axiosInstance from "@/helpers/axios";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";

const ActivityTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedActivity, setselectedActivity] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [],
    price: "",
    price_discount: "",
    rating: "",
    address: "",
    city: "",
    province: "",
    city: "",
    location_maps: "",
  });
  const [editFormData, setEditFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [],
    price: "",
    price_discount: "",
    rating: "",
    address: "",
    city: "",
    province: "",
    city: "",
    location_maps: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBanner, setDataBanner] = useState([]);

  const fetchDataActivities = () => {
    axios
      .get("/api/v1/activities", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        console.log("Data Activities:", res.data.data);
        setDataBanner(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDataCategories = () => {
    axios
      .get("/api/v1/categories", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((res) => {
        console.log("Data categories:", res.data.data);
        setCategories(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchDataActivities();
    fetchDataCategories();
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Bisa diubah ke 2 kalau mau ada koma
    }).format(number);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setImagePreview(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
  };

  const handleOpenEditModal = (activity) => {
    console.log("Opening edit modal for activity:", activity);
    setselectedActivity(activity);
    setEditFormData({
      categoryId: activity.categoryId || "",
      title: activity.title || "",
      description: activity.description || "",
      imageUrls: activity.imageUrls || [],
      price: activity.price || "",
      price_discount: activity.price_discount || "",
      rating: activity.rating || "",
      address: activity.address || "",
      city: activity.city || "",
      province: activity.province || "",
      location_maps: activity.location_maps || "",
    });
    setEditImagePreview(activity.imageUrls?.[0] || null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setselectedActivity(null);
    setEditFormData({
      categoryId: "",
      title: "",
      description: "",
      imageUrls: [],
      price: "",
      price_discount: "",
      rating: "",
      address: "",
      city: "",
      province: "",
      location_maps: "",
    });
    setEditImagePreview(null);
  };

  const handleOpenPreview = (activity) => {
    setselectedActivity(activity);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setselectedActivity(null);
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

    if (!formData.title.trim()) {
      alert("Judul activity harus diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        "/api/v1/create-activity",
        formData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Activity berhasil ditambahkan!");
      handleCloseModal();
      fetchDataActivities();
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Gagal menambahkan activity. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.title.trim()) {
      alert("Judul activity harus diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        `/api/v1/update-activity/${selectedActivity.id}`,
        editFormData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Activity berhasil diperbarui!");
      handleCloseEditModal();
      fetchDataActivities();
    } catch (err) {
      console.error("Error updating activity:", err);
      alert("Gagal memperbarui activity. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (activityId) => {
    try {
      const res = await axiosInstance.delete(
        `/api/v1/delete-activity/${activityId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        alert("Activity berhasil dihapus!");
        fetchDataActivities();
      }
    } catch (error) {
      alert("Gagal menghapus activity. Silakan coba lagi.");
      console.error("Error deleting activity:", error);
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
            Activity Management
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola activity yang ditampilkan di aplikasi
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Tambah activity
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
                  Nama activity
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Address
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
              {currentItems.map((activity, index) => (
                <tr
                  key={activity.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Nomor */}
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                    {index + 1}
                  </td>

                  {/* Preview Image */}
                  <td className="py-4 px-4">
                    <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                      {activity.imageUrls[0] ? (
                        <>
                          <img
                            src={activity.imageUrls[0]}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Nama activity */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {activity.title}
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate max-w-xs"
                      title={activity.imageUrls[0]}
                    >
                      {activity.imageUrls[0]}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatRupiah(activity.price)}
                  </td>

                  {/* Address */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {activity.address}
                  </td>

                  {/* Created At */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(activity.createdAt)}
                  </td>

                  {/* Updated At */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(activity.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleOpenPreview(activity)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(activity)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit activity"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus activity"
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
              Belum ada activity
            </h3>
            <p className="text-gray-500 mb-4">
              Mulai dengan menambahkan activity pertama Anda
            </p>
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Tambah activity
            </button>
          </div>
        )}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} Activities
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

      {/* Modal Tambah activity */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Tambah Activity Baru
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Informasi Dasar
                    </h3>

                    {/* Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Activity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama activity"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan deskripsi activity"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Image URL */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Gambar <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="imageUrls"
                        value={formData.imageUrls}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>

                    {/* Image Preview */}
                    {formData.imageUrls && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview Gambar
                        </label>
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={formData.imageUrls}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-full h-48 hidden items-center justify-center text-gray-400">
                            <div className="text-center">
                              <ImageIcon size={48} className="mx-auto mb-2" />
                              <p>Gambar tidak dapat dimuat</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">
                      Informasi Harga
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Price */}
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                          Harga Asli <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="100000"
                          required
                        />
                      </div>

                      {/* Discount Price */}
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                          Harga Diskon <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price_discount"
                          value={formData.price_discount}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="80000"
                          required
                        />
                      </div>
                    </div>

                    {/* Price Preview */}
                    {formData.price && formData.price_discount && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">Preview Harga:</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-blue-900">
                            Rp{" "}
                            {parseInt(formData.price_discount).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                          {formData.price !== formData.price_discount && (
                            <span className="text-sm text-gray-500 line-through">
                              Rp{" "}
                              {parseInt(formData.price).toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Location and Additional Info */}
                <div className="space-y-6">
                  {/* Location Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-green-900 mb-4">
                      Informasi Lokasi
                    </h3>

                    {/* Address */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-green-800 mb-2">
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan alamat lengkap"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Kota <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Jakarta"
                          required
                        />
                      </div>

                      {/* Province */}
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Provinsi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="DKI Jakarta"
                          required
                        />
                      </div>
                    </div>

                    {/* Location Maps */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-green-800 mb-2">
                        Google Maps Embed Code{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="location_maps"
                        value={formData.location_maps}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="<iframe src='...' width='600' height='450'></iframe>"
                        required
                      />
                      <p className="text-xs text-green-600 mt-1">
                        Dapatkan embed code dari Google Maps - Share - Embed a
                        map
                      </p>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-yellow-900 mb-4">
                      Rating & Review
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                          Rating (1-5) <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih Rating</option>
                          <option value="1">1 - Sangat Buruk</option>
                          <option value="2">2 - Buruk</option>
                          <option value="3">3 - Cukup</option>
                          <option value="4">4 - Baik</option>
                          <option value="5">5 - Sangat Baik</option>
                        </select>
                      </div>

                      {/* Total Reviews */}
                      <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                          Total Reviews <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="total_reviews"
                          value={formData.total_reviews}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="100"
                          required
                        />
                      </div>
                    </div>

                    {/* Rating Preview */}
                    {formData.rating && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">Preview Rating:</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < parseInt(formData.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({formData.total_reviews} reviews)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facilities */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-900 mb-4">
                      Fasilitas
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">
                        Daftar Fasilitas
                      </label>
                      <textarea
                        name="facilities"
                        value={formData.facilities}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="<p>WiFi gratis</p><p>Parking area</p><p>Wheelchair accessible</p>"
                      />
                      <p className="text-xs text-purple-600 mt-1">
                        Gunakan HTML tags untuk formatting (contoh:
                        &lt;p&gt;Fasilitas&lt;/p&gt;). Kosongkan jika tidak ada
                        fasilitas.
                      </p>
                    </div>

                    {/* Facilities Preview */}
                    {formData.facilities && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">
                          Preview Fasilitas:
                        </p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formData.facilities,
                          }}
                          className="text-sm text-purple-700 mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Tips */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-indigo-900 mb-2">
                      💡 Tips Pengisian Form
                    </h4>
                    <ul className="text-sm text-indigo-800 space-y-1">
                      <li>
                        • Pastikan URL gambar dapat diakses dan berformat
                        JPG/PNG
                      </li>
                      <li>
                        • Harga diskon sebaiknya lebih kecil dari harga asli
                      </li>
                      <li>• Alamat harus lengkap dan akurat</li>
                      <li>
                        • Google Maps embed code bisa didapat dari
                        maps.google.com
                      </li>
                      <li>• Rating dan jumlah review harus realistis</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                {/* Form Status */}
                <div className="text-sm text-gray-500">
                  * Field yang wajib diisi
                </div>

                <div className="flex space-x-3">
                  {/* <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw size={16} className="inline mr-2" />
                    Reset Form
                  </button> */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          size={16}
                          className="inline mr-2 animate-spin"
                        />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="inline mr-2" />
                        Tambah Activity
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit activity */}
      {isEditModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Update Activity
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Informasi Dasar
                    </h3>

                    {/* Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Activity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama activity"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan deskripsi activity"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="categoryId"
                        value={editFormData.categoryId}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Image URL */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Gambar <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="imageUrls"
                        value={
                          Array.isArray(editFormData.imageUrls)
                            ? editFormData.imageUrls[0]
                            : editFormData.imageUrls
                        }
                        onChange={(e) =>
                          setFormData({
                            ...editFormData,
                            imageUrls: [e.target.value],
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>

                    {/* Image Preview */}
                    {editFormData.imageUrls && editFormData.imageUrls[0] && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview Gambar
                        </label>
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              Array.isArray(editFormData.imageUrls)
                                ? editFormData.imageUrls[0]
                                : editFormData.imageUrls
                            }
                            alt="Preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-full h-48 hidden items-center justify-center text-gray-400">
                            <div className="text-center">
                              <ImageIcon size={48} className="mx-auto mb-2" />
                              <p>Gambar tidak dapat dimuat</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">
                      Informasi Harga
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Price */}
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                          Harga Asli <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="100000"
                          required
                        />
                      </div>

                      {/* Discount Price */}
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                          Harga Diskon <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price_discount"
                          value={editFormData.price_discount}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="80000"
                          required
                        />
                      </div>
                    </div>

                    {/* Price Preview */}
                    {editFormData.price && editFormData.price_discount && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">Preview Harga:</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-blue-900">
                            Rp{" "}
                            {parseInt(editFormData.price_discount).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                          {editFormData.price !== editFormData.price_discount && (
                            <span className="text-sm text-gray-500 line-through">
                              Rp{" "}
                              {parseInt(editFormData.price).toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Location and Additional Info */}
                <div className="space-y-6">
                  {/* Location Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-green-900 mb-4">
                      Informasi Lokasi
                    </h3>

                    {/* Address */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-green-800 mb-2">
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan alamat lengkap"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Kota <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editFormData.city}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Jakarta"
                          required
                        />
                      </div>

                      {/* Province */}
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Provinsi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={editFormData.province}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="DKI Jakarta"
                          required
                        />
                      </div>
                    </div>

                    {/* Location Maps */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-green-800 mb-2">
                        Google Maps Embed Code{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="location_maps"
                        value={editFormData.location_maps}
                        onChange={handleEditInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="<iframe src='...' width='600' height='450'></iframe>"
                        required
                      />
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-yellow-900 mb-4">
                      Rating & Review
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                          Rating (1-5) <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="rating"
                          value={editFormData.rating}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih Rating</option>
                          <option value="1">1 - Sangat Buruk</option>
                          <option value="2">2 - Buruk</option>
                          <option value="3">3 - Cukup</option>
                          <option value="4">4 - Baik</option>
                          <option value="5">5 - Sangat Baik</option>
                        </select>
                      </div>

                      {/* Total Reviews */}
                      <div>
                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                          Total Reviews <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="total_reviews"
                          value={editFormData.total_reviews}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="100"
                          required
                        />
                      </div>
                    </div>

                    {/* Rating Preview */}
                    {formData.rating && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm text-gray-600">Preview Rating:</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < parseInt(editFormData.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({editFormData.total_reviews} reviews)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facilities */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-900 mb-4">
                      Fasilitas
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">
                        Daftar Fasilitas
                      </label>
                      <textarea
                        name="facilities"
                        value={editFormData.facilities}
                        onChange={handleEditInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="<p>WiFi gratis</p><p>Parking area</p><p>Wheelchair accessible</p>"
                      />
                      <p className="text-xs text-purple-600 mt-1">
                        Gunakan HTML tags untuk formatting (contoh:
                        &lt;p&gt;Fasilitas&lt;/p&gt;)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="inline mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview activity */}
      {isPreviewModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Preview Activity
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
                {/* Image and Map Preview */}
                <div className="space-y-4">
                  {/* Activity Image */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Gambar Activity
                    </h3>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={selectedActivity.imageUrls[0]}
                        alt={selectedActivity.title}
                        className="w-full h-auto max-h-60 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-60 hidden items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon size={48} className="mx-auto mb-2" />
                          <p>Gambar tidak dapat dimuat</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Lokasi
                    </h3>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedActivity.location_maps,
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      URL Gambar:
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      {selectedActivity.imageUrls[0]}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedActivity.imageUrls[0]
                        );
                        alert("URL berhasil disalin!");
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Salin URL
                    </button>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detail Activity
                  </h3>

                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Nama Activity
                        </p>
                        <p className="text-lg text-gray-900 font-semibold">
                          {selectedActivity.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Deskripsi
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedActivity.description ||
                            "Tidak ada deskripsi"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Kategori
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedActivity.category?.name ||
                            "Tidak ada kategori"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Rating */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Harga
                        </p>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-blue-900">
                            Rp{" "}
                            {selectedActivity.price_discount?.toLocaleString(
                              "id-ID"
                            )}
                          </p>
                          {selectedActivity.price !==
                            selectedActivity.price_discount && (
                            <p className="text-sm text-gray-500 line-through">
                              Rp{" "}
                              {selectedActivity.price?.toLocaleString("id-ID")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Rating
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < selectedActivity.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({selectedActivity.total_reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">
                      Informasi Lokasi
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin size={14} className="text-green-600 mr-2" />
                        <span className="text-green-700">
                          {selectedActivity.address}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-700">
                          {selectedActivity.city}, {selectedActivity.province}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">
                      Fasilitas
                    </h4>
                    <p className="text-sm text-purple-700">
                      {selectedActivity.facilities || "Tidak ada fasilitas"}
                    </p>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tanggal Dibuat
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedActivity.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Terakhir Diperbarui
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedActivity.updatedAt)}
                        </p>
                      </div>
                    </div>
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
                          handleOpenEditModal(selectedActivity);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <Edit size={16} className="inline mr-2" />
                        Edit Activity
                      </button>
                      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                        <Trash2 size={16} className="inline mr-2" />
                        Hapus Activity
                      </button>
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
                  handleOpenEditModal(selectedActivity);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
