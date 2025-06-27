import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white mt-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <button className="bg-white py-2 px-5 rounded-xl shadow-2xl hover:shadow-emerald-300/50 transition-all duration-300 hover:scale-105">
                <img
                  className="h-8"
                  src="images/logo-kecil.png"
                  alt="Company Logo"
                />
              </button>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              Temukan keajaiban tersembunyi dengan Tripantara. Kami menghadirkan
              pengalaman wisata tak terlupakan di seluruh Nusantara dengan
              pelayanan terbaik.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <IconBrandFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <IconBrandTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <IconBrandInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <IconBrandLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Layanan Wisata</h3>
            <ul className="space-y-3">
              {[
                "Paket Tour Nusantara",
                "Wisata Budaya",
                "Adventure Travel",
                "Honeymoon Package",
                "Group Travel",
                "Custom Itinerary",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-emerald-100 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-emerald-100">
                    Jl. Wisata Nusantara No. 88
                    <br />
                    Jakarta Pusat, 10120
                    <br />
                    Indonesia
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <div>
                  <p className="text-emerald-100">+62 21 8888 9999</p>
                  <p className="text-emerald-100">+62 812 3456 7890</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <div>
                  <p className="text-emerald-100">info@tripantara.com</p>
                  <p className="text-emerald-100">booking@tripantara.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Newsletter Wisata</h3>
            <p className="text-emerald-100">
              Dapatkan inspirasi destinasi menarik dan penawaran spesial
              langsung di inbox Anda.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              <button className="w-full bg-white text-emerald-600 py-3 px-6 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-300 flex items-center justify-center group">
                Berlangganan
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Payment Partners */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <h3 className="text-lg font-medium mb-6 text-center">
            Partner Pembayaran Terpercaya
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              "Visa",
              "Mastercard",
              "PayPal",
              "GoPay",
              "OVO",
              "DANA",
              "ShopeePay",
              "LinkAja",
            ].map((partner, index) => (
              <div
                key={index}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <span className="text-emerald-100 font-medium text-sm">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex justify-center md:flex-row items-center space-y-4 md:space-y-0">
            <p className="text-emerald-100 text-center">
              © 2025 Tripantara Travel Indonesia. Semua hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
