import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ReportBug from "./pages/ReportBug";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Router>
            <div className="flex h-screen">
                {/* Sidebar Only */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/report-bug" element={<ReportBug />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
