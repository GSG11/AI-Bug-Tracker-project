import { useState } from "react";

const BugReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.priority) {
      alert("Please fill all fields before submitting.");
      return;
    }

    console.log("Submitting:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/bugs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        alert("Bug reported successfully!");
        setFormData({ title: "", description: "", priority: "Medium" });
      } else {
        alert(`Failed to report bug: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting bug:", error);
      alert("Error submitting bug. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Report a Bug</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Bug Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter bug title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Submit Bug Report
        </button>
      </form>
    </div>
  );
};

export default BugReportForm;
