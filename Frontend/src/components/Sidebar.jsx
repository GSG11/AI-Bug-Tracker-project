import { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Navigation hook

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white h-screen transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isOpen && <h2 className="text-lg font-bold">AI Bug Tracker</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-700 transition"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        {isOpen && (
          <nav className="mt-4">
            <button
              onClick={() => navigate("/")}
              className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/report-bug")}
              className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md transition"
            >
              Report Bug
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md transition"
            >
              Dashboard
            </button>
          </nav>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
