import React from "react";

export default function TerminalHeader() {
  const getDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="flex justify-between items-center mb-2 px-2 sm:px-0">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>

      <div className="text-white text-xs sm:text-sm truncate font-mono">
        {getDate()}
      </div>
    </div>
  );
}
