import { useEffect, useState } from "react";

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/bugs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bugs");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Bugs:", data);
        setBugs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bugs:", err);
        setError("Failed to load bugs.");
        setLoading(false);
      });
  }, []);

  const handleEdit = (bug) => {
    setEditingId(bug._id);
    setEditData({ title: bug.title, description: bug.description, priority: bug.priority });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (bugId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bugs/${bugId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update bug");

      setBugs((prevBugs) =>
        prevBugs.map((bug) => (bug._id === bugId ? { ...bug, ...editData } : bug))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating bug:", error);
      setError("Failed to update bug.");
    }
  };

  const handleDelete = async (bugId) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    try {
      console.log("Deleting bug with ID:", bugId);
      const res = await fetch(`http://localhost:5000/api/bugs/${bugId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete bug");

      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
    } catch (error) {
      console.error("Error deleting bug:", error);
      setError("Failed to delete bug.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading bugs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-screen overflow-hidden">
      
      {bugs.length === 0 ? (
        <p className="text-gray-500">No bugs reported yet.</p>
      ) : (
        <ul className="space-y-4">
          {bugs.map((bug) => (
            <li key={bug._id} className="bg-white border p-4 rounded-lg shadow-md w-full md:w-3/4 mx-auto">
              {editingId === bug._id ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full p-2 border rounded-md mb-2"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <div className="mt-3 space-x-2">
                    <button onClick={() => handleSave(bug._id)} className="bg-green-500 text-white px-3 py-1 rounded">
                      Save
                    </button>
                    <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 rounded">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{bug.title}</h3>
                  <p className="text-sm text-gray-600">{bug.description}</p>
                  <p className="mt-2">
                    <strong>Priority:</strong>{" "}
                    <span className={`ml-1 ${bug.priority === "High" ? "text-red-500" : "text-blue-500"}`}>
                      {bug.priority}
                    </span>
                  </p>
                  <div className="mt-3 space-x-2">
                    <button onClick={() => handleEdit(bug)} className="bg-blue-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(bug._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BugList;
