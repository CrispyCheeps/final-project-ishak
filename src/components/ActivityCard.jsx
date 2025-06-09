import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ActivityCard = ({ id, title, description, imageUrl }) => {
  const navigate = useNavigate();
  console.log("ActivityCard key:", id);

  return (
    <Card className="w-sm max-w-md mx-auto overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || "https://via.placeholder.com/400x300"}
          alt="Image placeholder"
          className="w-full h-48 inset-0 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Overlay Animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-6 right-6 w-2 h-2 bg-teal-300 rounded-full animate-pulse delay-75"></div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 relative">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-100/0 group-hover:from-teal-50/30 group-hover:to-teal-100/20 transition-all duration-500 rounded-b-lg"></div>

        <div className="relative z-10">
          <h3 className="text-lg font-medium text-gray-700 mb-4 transform transition-all duration-300 group-hover:text-teal-700 group-hover:translate-x-1">
            {title || "Promo Title"}
          </h3>

          <Button
            onClick={() => {
              navigate(`/activity/${id}`); // Navigate to the activity details page
            }}
            className="w-full bg bg-gradient-to-r from-[#2CAB98] to-[#329AC0] hover:bg-teal-600 text-white py-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group/btn"
          >
            {/* Button Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10">Lihat Activity</span>
          </Button>
        </div>

        {/* Floating Decoration */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-200 rounded-full opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-500 delay-200"></div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
