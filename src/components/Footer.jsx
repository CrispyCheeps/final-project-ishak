import React from "react";

const Footer = () => {
  return (
    <footer className="bg-emerald-500 text-white mt-12 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="mb-8">
          {/* Logo */}
          <div className="hidden md:block">
            <button className="bg-white py-1 px-4 rounded-xl shadow-2xl text-white font-semibold hover:from-blue-600 hover:to-green-500 hover:shadow-green-500 shadow-blue-500">
              <img className="h-8" src="images/logo-kecil.png" alt="" />
            </button>
          </div>
        </div>

        {/* Partner Section */}
        <div className="mb-16">
          <h2 className="text-xl font-medium mb-4">Partner pembayaran</h2>
          {/* You can add payment partner logos here */}
          <div className="flex flex-wrap gap-4">
            {/* Placeholder for payment logos */}
            <div className="w-16 h-10 bg-white/20 rounded"></div>
            <div className="w-16 h-10 bg-white/20 rounded"></div>
            <div className="w-16 h-10 bg-white/20 rounded"></div>
            <div className="w-16 h-10 bg-white/20 rounded"></div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-lg">Copyright 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
