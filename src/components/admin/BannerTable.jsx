import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

// Sample data berdasarkan struktur yang diberikan
const sampleBanners = [
  {
    id: "dab664e3-b5dd-432e-8a17-3ad487ed2358",
    name: "Lake Toba",
    imageUrl: "https://travel-journal-api-bootcamp.do.dibimbing.id/images/1750135801582-lake-toba-view-v2.jpg",
    createdAt: "2025-06-17T04:18:43.885Z",
    updatedAt: "2025-06-17T04:50:04.749Z"
  },
  {
    id: "f7a8b9c0-d1e2-4f3a-8b9c-0d1e2f3a4b5c",
    name: "Banner 1",
    imageUrl: "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2021/12/08/9c6ae660-1799-4276-b81d-f8b0b85669d6-1638949473006-1e6c55a1b1edca6bf250012af2cc79e2.jpg",
    createdAt: "2025-06-15T08:30:15.123Z",
    updatedAt: "2025-06-16T12:45:22.456Z"
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Mountain Adventure",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    createdAt: "2025-06-10T14:20:30.789Z",
    updatedAt: "2025-06-12T16:15:45.321Z"
  }
];

const BannerTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormData({ name: '', imageUrl: '', imageFile: null });
    setImagePreview(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', imageUrl: '', imageFile: null });
    setImagePreview(null);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nama banner harus diisi.');
      return;
    }
    
    if (!formData.imageFile) {
      alert('Gambar banner harus dipilih.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Data yang akan dikirim:', formData);
      setIsLoading(false);
      handleCloseModal();
      alert('Banner berhasil ditambahkan!');
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">Kelola banner yang ditampilkan di aplikasi</p>
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
                <th className="text-left py-3 px-4 font-medium text-gray-900">No</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Preview</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nama Banner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dibuat</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Diperbarui</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {sampleBanners.map((banner, index) => (
                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
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
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    </div>
                  </td>
                  
                  {/* Nama Banner */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{banner.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs" title={banner.imageUrl}>
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
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Banner"
                      >
                        <Edit size={16} />
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Banner"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      {/* More Options */}
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Opsi Lainnya"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sampleBanners.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada banner</h3>
            <p className="text-gray-500 mb-4">Mulai dengan menambahkan banner pertama Anda</p>
            <button 
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Tambah Banner
            </button>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>Menampilkan</span>
              <span className="font-medium mx-1">1</span>
              <span>sampai</span>
              <span className="font-medium mx-1">{sampleBanners.length}</span>
              <span>dari</span>
              <span className="font-medium mx-1">{sampleBanners.length}</span>
              <span>hasil</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Sebelumnya
              </button>
              <button className="px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded-md">
                1
              </button>
              <button 
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Selanjutnya
              </button>
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
              <h2 className="text-xl font-semibold text-gray-900">Tambah Banner Baru</h2>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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

              {/* Upload Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Banner *
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, imageFile: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.imageFile?.name}
                    </p>
                  </div>
                )}

                {/* File Input */}
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imagePreview ? (
                        <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                      ) : (
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      )}
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                    </div>
                  </label>
                </div>
              </div>

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
                  {isLoading ? 'Menyimpan...' : 'Simpan Banner'}
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
              <h2 className="text-xl font-semibold text-gray-900">Preview Banner</h2>
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
                  <h3 className="text-lg font-medium text-gray-900">Gambar Banner</h3>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedBanner.imageUrl} 
                      alt={selectedBanner.name}
                      className="w-full h-auto max-h-80 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
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
                    <p className="text-sm font-medium text-gray-700 mb-1">URL Gambar:</p>
                    <p className="text-sm text-gray-600 break-all">{selectedBanner.imageUrl}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedBanner.imageUrl);
                        alert('URL berhasil disalin!');
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Salin URL
                    </button>
                  </div>
                </div>

                {/* Banner Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Detail Banner</h3>
                  
                  {/* Banner Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">ID Banner</p>
                          <p className="text-sm text-gray-600 font-mono">{selectedBanner.id}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nama Banner</p>
                          <p className="text-sm text-gray-900 font-medium">{selectedBanner.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Tanggal Dibuat</p>
                          <p className="text-sm text-gray-600">{formatDate(selectedBanner.createdAt)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Terakhir Diperbarui</p>
                          <p className="text-sm text-gray-600">{formatDate(selectedBanner.updatedAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Banner */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm font-medium text-green-800">Status: Banner Aktif</p>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Banner ini sedang ditampilkan di aplikasi</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Aksi Cepat</h4>
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
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
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Informasi Tambahan</h4>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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