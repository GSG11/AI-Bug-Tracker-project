import { useState, useRef } from "react";

const BugReportForm = () => {
  const [formData, setFormData] = useState({
    Summary: "",
    description: "",
    priority: "P3",
  });

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Summary || !formData.description || !formData.priority) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        setAiResult(data.aiAnalysis);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        alert("Bug reported successfully.");
        setFormData({ Summary: "", description: "", priority: "P3" });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting bug:", error);
      alert("Server error while submitting bug.");
    } finally {
      setLoading(false);
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
            name="Summary"
            placeholder="Enter bug title"
            value={formData.Summary}
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
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
            <option value="P5">P5</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Bug Report"}
        </button>
      </form>

      {aiResult && (
        <div
          ref={resultRef}
          className="mt-6 p-4 bg-gray-100 rounded border border-gray-300"
        >
          <h3 className="font-semibold mb-2 text-lg">AI Analysis</h3>

          {aiResult.duplicates && Array.isArray(aiResult.duplicates) && aiResult.duplicates.length > 0 ? (
            <>
              <p className="text-red-600 font-medium">Similar bug reports found:</p>
              {aiResult.duplicates.map((dup, idx) => (
                <p key={idx} className="text-sm text-gray-800">
                  - Title: <strong>{dup["Existing Report"]}</strong> (Similarity: {dup.Similarity})
                </p>
              ))}
            </>
          ) : (
            <p className="text-green-700">No similar bug reports found.</p>
          )}

          <p><strong>Bug Type:</strong> {aiResult.bug_type}</p>
          <p><strong>Severity:</strong> {aiResult.severity}</p>
          <p><strong>Is Functional:</strong> {aiResult.is_functional ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default BugReportForm;
