import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white items-center">
      <h1 className="text-3xl font-bold text-black text-center mt-10">
        Welcome to <span className="text-black">AI Bug Tracker</span>
      </h1>
      <p className="text-black mt-16 text-lg ml-10">
        Manage and track your software bugs efficiently.
      </p>
    </div>
  );
};

export default HomePage;
